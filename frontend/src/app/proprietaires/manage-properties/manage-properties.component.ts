import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { ProprietairesService, Property } from '../services/proprietaires.service';

@Component({
  selector: 'app-manage-properties',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatMenuModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatTableModule
  ],
  templateUrl: './manage-properties.component.html',
  styleUrls: ['./manage-properties.component.scss']
})
export class ManagePropertiesComponent implements OnInit, AfterViewInit, OnDestroy {
  properties: Property[] = [];
  filteredProperties: Property[] = [];
  loading = true;
  private propertiesSub?: Subscription;

  // Search and Filtering
  searchQuery = '';
  filterType = '';
  filterStatus = '';

  // View Mode
  viewMode: 'grid' | 'list' = 'grid';

  // Selection and Bulk Operations
  selectedProperties: number[] = [];

  // Table columns for list view
  displayedColumns: string[] = ['select', 'property', 'type', 'specs', 'price', 'status', 'actions'];

  constructor(
    private proprietairesService: ProprietairesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    // Subscribe to shared properties stream and trigger initial load
    this.propertiesSub = this.proprietairesService.properties$.subscribe(list => {
      if (Array.isArray(list)) {
        this.properties = list;
        this.filteredProperties = [...list]; // Initialize filtered properties
        this.loading = false;
        console.debug('[ManageProperties] properties updated:', list.length);
        this.cdr.detectChanges();
      }
    });
    // Seed the stream and also do a direct load as a fallback
    this.proprietairesService.refreshProperties();
    this.loadProperties();
  }

  ngOnDestroy(): void {
    this.propertiesSub?.unsubscribe();
  }

  private loadProperties(): void {
    this.proprietairesService.getOwnerProperties().subscribe({
      next: (properties) => {
        this.properties = properties;
        this.filteredProperties = [...properties]; // Initialize filtered properties
        this.loading = false;
        console.debug('[ManageProperties] loaded properties:', properties.length);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading properties:', error);
        this.loading = false;
        this.snackBar.open('Erreur lors du chargement des propriétés', 'Fermer', { duration: 3000 });
        this.cdr.detectChanges();
      }
    });
  }

  togglePropertyStatus(property: Property): void {
    const updatedProperty = { ...property, isActive: !property.isActive };
    
    this.proprietairesService.updateProperty(property.id!, { isActive: updatedProperty.isActive }).subscribe({
      next: (updated) => {
        const index = this.properties.findIndex(p => p.id === property.id);
        if (index >= 0) {
          this.properties[index] = updated;
        }
        this.applyFilters(); // Refresh filtered properties
        
        const status = updated.isActive ? 'activée' : 'désactivée';
        this.snackBar.open(`Propriété ${status} avec succès`, 'Fermer', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error updating property status:', error);
        this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
      }
    });
  }

  deleteProperty(property: Property): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${property.title}" ?`)) {
      this.proprietairesService.deleteProperty(property.id!).subscribe({
        next: () => {
          this.properties = this.properties.filter(p => p.id !== property.id);
          this.applyFilters(); // Refresh filtered properties
          this.snackBar.open('Propriété supprimée avec succès', 'Fermer', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error deleting property:', error);
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  getStatusChip(property: Property): { text: string, color: string } {
    if (!property.isActive) {
      return { text: 'Inactif', color: 'warn' };
    }
    return { text: 'Actif', color: 'primary' };
  }

  getPropertyTypeLabel(type: string): string {
    const types: { [key: string]: string } = {
      'apartment': 'Appartement',
      'house': 'Maison',
      'villa': 'Villa',
      'studio': 'Studio',
      'loft': 'Loft',
      'chalet': 'Chalet'
    };
    return types[type] || type;
  }

  getPropertyTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'apartment': 'apartment',
      'house': 'house',
      'villa': 'villa',
      'studio': 'home',
      'loft': 'business',
      'chalet': 'cabin'
    };
    return icons[type] || 'home';
  }

  // Search and Filtering
  onSearchChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredProperties = this.properties.filter(property => {
      const matchesSearch = !this.searchQuery || 
        property.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesType = !this.filterType || property.propertyType === this.filterType;
      
      const matchesStatus = !this.filterStatus || 
        (this.filterStatus === 'active' && property.isActive) ||
        (this.filterStatus === 'inactive' && !property.isActive);
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filterType = '';
    this.filterStatus = '';
    this.applyFilters();
  }

  // View Mode
  onViewModeChange(): void {
    // Any additional logic when view mode changes
  }

  // Selection Management
  isPropertySelected(propertyId: number): boolean {
    return this.selectedProperties.includes(propertyId);
  }

  togglePropertySelection(propertyId: number, selected: boolean): void {
    if (selected) {
      if (!this.selectedProperties.includes(propertyId)) {
        this.selectedProperties.push(propertyId);
      }
    } else {
      this.selectedProperties = this.selectedProperties.filter(id => id !== propertyId);
    }
  }

  toggleAllSelection(selectAll: boolean): void {
    if (selectAll) {
      this.selectedProperties = this.filteredProperties.map(p => p.id!).filter(id => id !== undefined);
    } else {
      this.selectedProperties = [];
    }
  }

  get allSelected(): boolean {
    return this.filteredProperties.length > 0 && 
           this.selectedProperties.length === this.filteredProperties.length;
  }

  get someSelected(): boolean {
    return this.selectedProperties.length > 0 && 
           this.selectedProperties.length < this.filteredProperties.length;
  }

  // Bulk Operations
  bulkActivate(): void {
    const selectedProps = this.properties.filter(p => this.selectedProperties.includes(p.id!));
    const updates = selectedProps.map(property => 
      this.proprietairesService.updateProperty(property.id!, { isActive: true })
    );

    Promise.all(updates.map(update => update.toPromise())).then(() => {
      selectedProps.forEach(property => {
        const index = this.properties.findIndex(p => p.id === property.id);
        if (index >= 0) {
          this.properties[index].isActive = true;
        }
      });
      this.applyFilters();
      this.selectedProperties = [];
      this.snackBar.open('Propriétés activées avec succès', 'Fermer', { duration: 3000 });
    }).catch(error => {
      console.error('Error activating properties:', error);
      this.snackBar.open('Erreur lors de l\'activation', 'Fermer', { duration: 3000 });
    });
  }

  bulkDeactivate(): void {
    const selectedProps = this.properties.filter(p => this.selectedProperties.includes(p.id!));
    const updates = selectedProps.map(property => 
      this.proprietairesService.updateProperty(property.id!, { isActive: false })
    );

    Promise.all(updates.map(update => update.toPromise())).then(() => {
      selectedProps.forEach(property => {
        const index = this.properties.findIndex(p => p.id === property.id);
        if (index >= 0) {
          this.properties[index].isActive = false;
        }
      });
      this.applyFilters();
      this.selectedProperties = [];
      this.snackBar.open('Propriétés désactivées avec succès', 'Fermer', { duration: 3000 });
    }).catch(error => {
      console.error('Error deactivating properties:', error);
      this.snackBar.open('Erreur lors de la désactivation', 'Fermer', { duration: 3000 });
    });
  }

  bulkDelete(): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ${this.selectedProperties.length} propriété(s) ?`)) {
      const deletePromises = this.selectedProperties.map(id => 
        this.proprietairesService.deleteProperty(id).toPromise()
      );

      Promise.all(deletePromises).then(() => {
        this.properties = this.properties.filter(p => !this.selectedProperties.includes(p.id!));
        this.applyFilters();
        this.selectedProperties = [];
        this.snackBar.open('Propriétés supprimées avec succès', 'Fermer', { duration: 3000 });
      }).catch(error => {
        console.error('Error deleting properties:', error);
        this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
      });
    }
  }

  // Additional Actions
  duplicateProperty(property: Property): void {
    const duplicatedProperty = {
      ...property,
      title: `${property.title} (Copie)`,
      id: undefined // Remove ID so it gets created as new
    };

    this.proprietairesService.createProperty(duplicatedProperty).subscribe({
      next: (created) => {
        this.properties.push(created);
        this.applyFilters();
        this.snackBar.open('Propriété dupliquée avec succès', 'Fermer', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error duplicating property:', error);
        this.snackBar.open('Erreur lors de la duplication', 'Fermer', { duration: 3000 });
      }
    });
  }

  viewAnalytics(property: Property): void {
    // TODO: Implement analytics view
    this.snackBar.open('Fonctionnalité des statistiques à venir', 'Fermer', { duration: 3000 });
  }

  private updatePropertiesState(): void {
    this.applyFilters();
    this.cdr.detectChanges();
  }

  // Stats Methods
  getActivePropertiesCount(): number {
    return this.properties.filter(p => p.isActive).length;
  }

  getAveragePrice(): number {
    if (this.properties.length === 0) return 0;
    const total = this.properties.reduce((sum, p) => sum + p.price, 0);
    return Math.round(total / this.properties.length);
  }

  getTotalRevenue(): number {
    // Mock revenue calculation - in real app this would come from bookings
    return this.properties.reduce((total, p) => {
      if (p.isActive) {
        // Assume 50% occupancy rate and 30 days per month
        return total + (p.price * 15);
      }
      return total;
    }, 0);
  }
}