import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule } from '@angular/forms';
import { ProprietairesService, Property, CalendarEvent } from '../services/proprietaires.service';

interface PricingRule {
  id?: number;
  startDate: Date;
  endDate: Date;
  price: number;
  title?: string;
  isWeekend?: boolean;
  isSpecialEvent?: boolean;
}

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: CalendarEvent[];
  price?: number;
  isBlocked: boolean;
  isBooked: boolean;
  isAvailable: boolean;
  status: 'available' | 'booked' | 'blocked' | 'disabled';
}

@Component({
  selector: 'app-property-calendar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatTooltipModule,
    MatTabsModule
  ],
  templateUrl: './property-calendar.component.html',
  styleUrls: ['./property-calendar.component.scss']
})
export class PropertyCalendarComponent implements OnInit {
  property: Property | null = null;
  propertyId: number = 0;
  calendarEvents: CalendarEvent[] = [];
  currentMonth: Date = new Date();
  currentTime: Date = new Date();
  loading = false; // Start with false to force display
  
  // Calendar display
  calendarDays: CalendarDay[] = [];
  selectedDates: Date[] = [];
  selectionMode: 'single' | 'range' | 'multiple' = 'range';
  viewMode: 'month' | 'week' = 'month';
  
  // Pricing management
  pricingRules: PricingRule[] = [];
  defaultPrice: number = 0;
  pricingForm: FormGroup;
  showPricingPanel: boolean = false;
  
  // UI state
  selectedTab: number = 0;
  
  monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  
  dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  dayHeaders = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  // New properties for premium template
  selectedStartDate: Date | null = null;
  selectedEndDate: Date | null = null;
  basePrice: number = 0;
  weekendMultiplier: number = 120;
  selectedSeason: string = 'summer';
  seasonalMultiplier: number = 150;
  showBulkPricing: boolean = false;
  bulkPrice: number = 0;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    private proprietairesService: ProprietairesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    console.log('Calendar component constructor called');
    console.log('Router URL:', this.router.url);
    
    // Immediate initialization to force display
    this.currentMonth = new Date();
    this.loading = false;
    
    // Initialize form
    this.pricingForm = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      title: [''],
      isWeekend: [false],
      isSpecialEvent: [false]
    });
  }



  ngOnInit(): void {
    // Initialize with current month
    this.currentMonth = new Date();
    console.log('Initial current month set to:', this.currentMonth);
    
    // Get property ID from route parameters
    this.route.params.subscribe(params => {
      this.propertyId = +params['id'];
      console.log('Calendar component initialized with property ID:', this.propertyId);
      console.log('Route params:', params);
      console.log('Full URL:', this.router.url);
      
      if (!this.propertyId || isNaN(this.propertyId)) {
        console.error('Invalid property ID:', this.propertyId);
        this.snackBar.open('ID de propriété invalide', 'Fermer', { duration: 3000 });
        this.initializeEmptyCalendar();
        this.loading = false;
        return;
      }
      
      this.loading = true;
      this.loadProperty();
      this.loadCalendarData();
      this.loadPricingRules();
      
      // Force refresh calendar after a short delay to ensure data is loaded
      setTimeout(() => {
        this.forceRefreshCalendar();
      }, 100);
    });
  }

  forceRefreshCalendar(): void {
    console.log('Force refreshing calendar...');
    console.log('Current state:', {
      loading: this.loading,
      propertyId: this.propertyId,
      currentMonth: this.currentMonth,
      eventsCount: this.calendarEvents.length,
      daysCount: this.calendarDays.length
    });
    
    this.generateCalendar();
    console.log('Calendar refreshed, days generated:', this.calendarDays.length);
  }

  private initializeEmptyCalendar(): void {
    // Initialize calendar with current month and no events
    this.calendarEvents = [];
    this.generateCalendar();
  }

  private loadProperty(): void {
    this.proprietairesService.getPropertyById(this.propertyId).subscribe({
      next: (property) => {
        this.property = property;
        this.defaultPrice = property.price || 0;
      },
      error: (error) => {
        console.error('Error loading property:', error);
        this.defaultPrice = 100; // Default fallback price
      }
    });
  }

  private loadPricingRules(): void {
    // TODO: Implement API call to load pricing rules
    // For now, initialize with empty array
    this.pricingRules = [];
  }

  private loadCalendarData(): void {
    const startDate = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    const endDate = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
    
    this.proprietairesService.getPropertyCalendar(this.propertyId, startDate, endDate).subscribe({
      next: (events) => {
        this.calendarEvents = events || [];
        this.generateCalendar();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading calendar:', error);
        this.calendarEvents = [];
        this.generateCalendar();
        this.loading = false;
      }
    });
  }



  private generateCalendar(): void {
    console.log('Generating calendar for month:', this.currentMonth);
    console.log('Current month details:', {
      year: this.currentMonth.getFullYear(),
      month: this.currentMonth.getMonth(),
      monthName: this.monthNames[this.currentMonth.getMonth()]
    });
    
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    this.calendarDays = [];
    console.log('Calendar events for generation:', this.calendarEvents);
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) { // 6 weeks max
      const events = this.getEventsForDate(currentDate);
      const isBlocked = events.some(e => e.type === 'blocked');
      const isBooked = events.some(e => e.type === 'booked');
      const isAvailable = !isBlocked && !isBooked;
      
      const dayData: CalendarDay = {
        date: new Date(currentDate),
        day: currentDate.getDate(),
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: this.isToday(currentDate),
        isSelected: this.isDateSelected(currentDate),
        events: events,
        price: this.getPriceForDate(currentDate),
        isBlocked: isBlocked,
        isBooked: isBooked,
        isAvailable: isAvailable,
        status: isBooked ? 'booked' : isBlocked ? 'blocked' : isAvailable ? 'available' : 'disabled'
      };
      
      this.calendarDays.push(dayData);
      currentDate.setDate(currentDate.getDate() + 1);
      
      // Stop if we've filled the month and are beyond it
      if (currentDate.getMonth() !== month && i >= 35) {
        break;
      }
    }
    
    console.log('Generated calendar days:', this.calendarDays.length);
    console.log('Sample calendar days:', this.calendarDays.slice(0, 10));
    console.log('Current month days:', this.calendarDays.filter(d => d.isCurrentMonth).length);
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  private getEventsForDate(date: Date): CalendarEvent[] {
    return this.calendarEvents.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      return date >= eventStart && date <= eventEnd;
    });
  }

  private isDateSelected(date: Date): boolean {
    return this.selectedDates.some(selectedDate => 
      selectedDate.toDateString() === date.toDateString()
    );
  }

  private getPriceForDate(date: Date): number {
    // Check if there's a specific pricing rule for this date
    const rule = this.pricingRules.find(rule => 
      date >= rule.startDate && date <= rule.endDate
    );
    
    if (rule) {
      return rule.price;
    }
    
    // Weekend pricing (optional feature)
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    if (isWeekend && this.property) {
      return this.defaultPrice * 1.2; // 20% markup for weekends
    }
    
    return this.defaultPrice;
  }

  // Date Selection Methods
  onDateClick(day: CalendarDay): void {
    if (!day.isCurrentMonth) return;
    
    const clickedDate = new Date(day.date);
    
    if (this.selectionMode === 'single') {
      this.selectedDates = [clickedDate];
    } else if (this.selectionMode === 'multiple') {
      const index = this.selectedDates.findIndex(date => 
        date.toDateString() === clickedDate.toDateString()
      );
      
      if (index >= 0) {
        this.selectedDates.splice(index, 1);
      } else {
        this.selectedDates.push(clickedDate);
      }
    } else if (this.selectionMode === 'range') {
      if (this.selectedDates.length === 0) {
        this.selectedDates = [clickedDate];
      } else if (this.selectedDates.length === 1) {
        const startDate = this.selectedDates[0];
        if (clickedDate > startDate) {
          this.selectedDates = this.getDateRange(startDate, clickedDate);
        } else {
          this.selectedDates = [clickedDate];
        }
      } else {
        this.selectedDates = [clickedDate];
      }
    }
    
    this.generateCalendar(); // Refresh to show selection
  }

  private getDateRange(startDate: Date, endDate: Date): Date[] {
    const dates: Date[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  }

  // Pricing Management Methods
  addPricingRule(): void {
    if (this.pricingForm.valid && this.selectedDates.length >= 2) {
      const formValue = this.pricingForm.value;
      const startDate = this.selectedDates[0];
      const endDate = this.selectedDates[this.selectedDates.length - 1];
      
      const newRule: PricingRule = {
        startDate,
        endDate,
        price: formValue.price,
        title: formValue.title || `Prix personnalisé`,
        isWeekend: formValue.isWeekend,
        isSpecialEvent: formValue.isSpecialEvent
      };
      
      this.pricingRules.push(newRule);
      this.savePricingRule(newRule);
      this.pricingForm.reset();
      this.selectedDates = [];
      this.generateCalendar();
      
      this.snackBar.open('Règle de tarification ajoutée', 'Fermer', { duration: 3000 });
    } else {
      this.snackBar.open('Veuillez sélectionner des dates et remplir le formulaire', 'Fermer', { duration: 3000 });
    }
  }

  private savePricingRule(rule: PricingRule): void {
    // TODO: Implement API call to save pricing rule
    console.log('Saving pricing rule:', rule);
  }

  deletePricingRule(rule: PricingRule): void {
    const index = this.pricingRules.findIndex(r => r.id === rule.id);
    if (index >= 0) {
      this.pricingRules.splice(index, 1);
      this.generateCalendar();
      this.snackBar.open('Règle de tarification supprimée', 'Fermer', { duration: 3000 });
    }
  }

  clearSelection(): void {
    this.selectedDates = [];
    this.generateCalendar();
  }

  // Enhanced Blocking Methods
  blockSelectedDates(): void {
    if (this.selectedDates.length === 0) {
      this.snackBar.open('Veuillez sélectionner des dates', 'Fermer', { duration: 3000 });
      return;
    }
    
    const startDate = this.selectedDates[0];
    const endDate = this.selectedDates[this.selectedDates.length - 1];
    const title = prompt('Titre pour le blocage (optionnel):') || 'Dates bloquées';
    
    this.proprietairesService.blockDates(this.propertyId, startDate, endDate, title).subscribe({
      next: (event) => {
        this.snackBar.open('Dates bloquées avec succès', 'Fermer', { duration: 3000 });
        this.selectedDates = [];
        this.loadCalendarData();
      },
      error: (error) => {
        console.error('Error blocking dates:', error);
        this.snackBar.open('Erreur lors du blocage des dates', 'Fermer', { duration: 3000 });
      }
    });
  }

  // Navigation Methods
  previousMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    this.loadCalendarData();
  }

  nextMonth(): void {
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    this.loadCalendarData();
  }

  goToToday(): void {
    this.currentMonth = new Date();
    this.loadCalendarData();
  }

  // View Mode Methods
  setViewMode(mode: 'month' | 'week'): void {
    this.viewMode = mode;
    this.generateCalendar();
  }

  setSelectionMode(mode: 'single' | 'range' | 'multiple'): void {
    this.selectionMode = mode;
    this.selectedDates = [];
    this.generateCalendar();
  }

  // Utility Methods
  getSelectedDateRange(): string {
    if (this.selectedDates.length === 0) return '';
    if (this.selectedDates.length === 1) {
      return this.selectedDates[0].toLocaleDateString('fr-FR');
    }
    
    const startDate = this.selectedDates[0];
    const endDate = this.selectedDates[this.selectedDates.length - 1];
    return `${startDate.toLocaleDateString('fr-FR')} - ${endDate.toLocaleDateString('fr-FR')}`;
  }

  getTotalPriceForSelection(): number {
    return this.selectedDates.reduce((total, date) => {
      return total + this.getPriceForDate(date);
    }, 0);
  }

  // Legacy method updates

  unblockEvent(event: CalendarEvent): void {
    if (event.type === 'blocked' && event.id) {
      this.proprietairesService.unblockDates(event.id).subscribe({
        next: () => {
          this.snackBar.open('Dates débloquées avec succès', 'Fermer', { duration: 3000 });
          this.loadCalendarData();
        },
        error: (error) => {
          console.error('Error unblocking dates:', error);
          this.snackBar.open('Erreur lors du déblocage des dates', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  getEventTypeClass(type: string): string {
    switch (type) {
      case 'booked': return 'booked';
      case 'blocked': return 'blocked';
      case 'available': return 'available';
      default: return '';
    }
  }

  getEventTypeLabel(type: string): string {
    switch (type) {
      case 'booked': return 'Réservé';
      case 'blocked': return 'Bloqué';
      case 'available': return 'Disponible';
      default: return type;
    }
  }

  getAvailableEventsCount(): number {
    return this.calendarEvents ? this.calendarEvents.filter(e => e.type === 'available').length : 0;
  }

  getBookedEventsCount(): number {
    return this.calendarEvents ? this.calendarEvents.filter(e => e.type === 'booked').length : 0;
  }

  getBlockedEventsCount(): number {
    return this.calendarEvents ? this.calendarEvents.filter(e => e.type === 'blocked').length : 0;
  }

  // Legacy method updates
  blockDates(): void {
    // Legacy method for backward compatibility
    this.showPricingPanel = true;
    this.selectedTab = 1; // Switch to pricing tab
  }

  getRecentEvents(): CalendarEvent[] {
    if (!this.calendarEvents) return [];
    
    // Sort by start date and return first 5
    return this.calendarEvents
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 5);
  }

  getCalendarDaysAsWeeks(): CalendarDay[][] {
    const weeks: CalendarDay[][] = [];
    for (let i = 0; i < this.calendarDays.length; i += 7) {
      weeks.push(this.calendarDays.slice(i, i + 7));
    }
    return weeks;
  }

  // Statistics Methods
  getMonthlyRevenue(): number {
    const currentMonth = this.currentMonth.getMonth();
    const currentYear = this.currentMonth.getFullYear();
    
    return this.calendarDays
      .filter(day => 
        day.isCurrentMonth && 
        day.isBooked &&
        day.date.getMonth() === currentMonth &&
        day.date.getFullYear() === currentYear
      )
      .reduce((total, day) => total + (day.price || 0), 0);
  }

  getOccupancyRate(): number {
    const currentMonthDays = this.calendarDays.filter(day => day.isCurrentMonth);
    const bookedDays = currentMonthDays.filter(day => day.isBooked);
    
    return currentMonthDays.length > 0 ? (bookedDays.length / currentMonthDays.length) * 100 : 0;
  }

  // New methods for premium template
  getAvailableDaysCount(): number {
    return this.calendarDays.filter(day => day.isAvailable && day.isCurrentMonth).length;
  }

  getBookedDaysCount(): number {
    return this.calendarDays.filter(day => day.isBooked && day.isCurrentMonth).length;
  }

  getBlockedDaysCount(): number {
    return this.calendarDays.filter(day => day.isBlocked && day.isCurrentMonth).length;
  }

  getAveragePrice(): number {
    const daysWithPrice = this.calendarDays.filter(day => day.price && day.isCurrentMonth);
    if (daysWithPrice.length === 0) return 0;
    
    const total = daysWithPrice.reduce((sum, day) => sum + (day.price || 0), 0);
    return Math.round(total / daysWithPrice.length);
  }

  getCurrentMonthYear(): string {
    return `${this.monthNames[this.currentMonth.getMonth()]} ${this.currentMonth.getFullYear()}`;
  }

  onDateRangeChange(): void {
    // Update selection when date range changes
    if (this.selectedStartDate && this.selectedEndDate) {
      this.selectedDates = this.getDatesInRange(this.selectedStartDate, this.selectedEndDate);
      this.updateCalendarSelection();
    }
  }

  hasSelectedDates(): boolean {
    return this.selectedDates.length > 0;
  }

  getSelectedDatesCount(): number {
    return this.selectedDates.length;
  }

  getTotalSelectedPrice(): number {
    return this.selectedDates.reduce((total, date) => {
      const day = this.calendarDays.find(d => this.isSameDate(d.date, date));
      return total + (day?.price || 0);
    }, 0);
  }

  getTotalBulkPrice(): number {
    return this.getSelectedDatesCount() * this.bulkPrice;
  }

  getDayClasses(day: CalendarDay): string {
    const classes = ['calendar-day'];
    
    if (!day.isCurrentMonth) classes.push('disabled');
    if (day.isSelected) classes.push('selected');
    if (day.isAvailable) classes.push('available');
    if (day.isBooked) classes.push('booked');
    if (day.isBlocked) classes.push('blocked');
    if (day.isToday) classes.push('today');
    
    return classes.join(' ');
  }

  toggleDaySelection(day: CalendarDay): void {
    if (!day.isCurrentMonth || day.isBooked) return;

    const dateIndex = this.selectedDates.findIndex(date => this.isSameDate(date, day.date));
    
    if (dateIndex >= 0) {
      this.selectedDates.splice(dateIndex, 1);
      day.isSelected = false;
    } else {
      this.selectedDates.push(day.date);
      day.isSelected = true;
    }

    // Update date range
    if (this.selectedDates.length > 0) {
      this.selectedDates.sort((a, b) => a.getTime() - b.getTime());
      this.selectedStartDate = this.selectedDates[0];
      this.selectedEndDate = this.selectedDates[this.selectedDates.length - 1];
    } else {
      this.selectedStartDate = null;
      this.selectedEndDate = null;
    }
  }

  setAvailable(): void {
    this.selectedDates.forEach(date => {
      const day = this.calendarDays.find(d => this.isSameDate(d.date, date));
      if (day) {
        day.isAvailable = true;
        day.isBlocked = false;
        day.status = 'available';
      }
    });
    this.snackBar.open('Dates rendues disponibles', 'Fermer', { duration: 3000 });
  }

  setBlocked(): void {
    this.selectedDates.forEach(date => {
      const day = this.calendarDays.find(d => this.isSameDate(d.date, date));
      if (day) {
        day.isAvailable = false;
        day.isBlocked = true;
        day.status = 'blocked';
      }
    });
    this.snackBar.open('Dates bloquées', 'Fermer', { duration: 3000 });
  }

  updateBasePrice(): void {
    if (this.property) {
      this.property.price = this.basePrice;
      // Apply to all available days
      this.calendarDays.forEach(day => {
        if (day.isAvailable) {
          day.price = this.basePrice;
        }
      });
      this.snackBar.open('Prix de base mis à jour', 'Fermer', { duration: 3000 });
    }
  }

  updateWeekendPricing(): void {
    this.calendarDays.forEach(day => {
      if (day.isAvailable && (day.date.getDay() === 0 || day.date.getDay() === 6)) {
        day.price = Math.round(this.basePrice * (this.weekendMultiplier / 100));
      }
    });
    this.snackBar.open('Tarifs week-end appliqués', 'Fermer', { duration: 3000 });
  }

  updateSeasonalPricing(): void {
    const seasonMonths = this.getSeasonMonths(this.selectedSeason);
    
    this.calendarDays.forEach(day => {
      if (day.isAvailable && seasonMonths.includes(day.date.getMonth())) {
        day.price = Math.round(this.basePrice * (this.seasonalMultiplier / 100));
      }
    });
    this.snackBar.open(`Tarifs ${this.selectedSeason} appliqués`, 'Fermer', { duration: 3000 });
  }

  applyBulkPricing(): void {
    this.selectedDates.forEach(date => {
      const day = this.calendarDays.find(d => this.isSameDate(d.date, date));
      if (day && day.isAvailable) {
        day.price = this.bulkPrice;
      }
    });
    
    this.showBulkPricing = false;
    this.selectedDates = [];
    this.updateCalendarSelection();
    this.snackBar.open('Prix mis à jour pour les dates sélectionnées', 'Fermer', { duration: 3000 });
  }

  private getSeasonMonths(season: string): number[] {
    const seasons = {
      'spring': [2, 3, 4], // Mar, Apr, May
      'summer': [5, 6, 7], // Jun, Jul, Aug
      'autumn': [8, 9, 10], // Sep, Oct, Nov
      'winter': [11, 0, 1] // Dec, Jan, Feb
    };
    return seasons[season as keyof typeof seasons] || [];
  }

  private getDatesInRange(startDate: Date, endDate: Date): Date[] {
    const dates: Date[] = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  }

  private updateCalendarSelection(): void {
    this.calendarDays.forEach(day => {
      day.isSelected = this.selectedDates.some(date => this.isSameDate(date, day.date));
    });
  }

  private isSameDate(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
}