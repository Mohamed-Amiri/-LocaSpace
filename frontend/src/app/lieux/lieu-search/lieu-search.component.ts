import { Component, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LieuService } from '../lieu.service';
import { Lieu } from '../lieu.model';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as L from 'leaflet';
import { FavoritesService } from '../../shared/favorites/favorites.service';
import { ActivatedRoute, Router } from '@angular/router';
import { QuickPreviewComponent } from '../../shared/preview/quick-preview.component';
import { SkeletonLoaderComponent } from '../../shared/skeleton-loader/skeleton-loader.component';
// @ts-ignore markercluster plugin
import 'leaflet.markercluster';

@Component({
  selector: 'app-lieu-search',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, QuickPreviewComponent],
  templateUrl: './lieu-search.component.html',
  styleUrls: ['./lieu-search.component.scss']
})
export class LieuSearchComponent implements OnInit, OnDestroy, AfterViewInit {
  locations: Lieu[] = [];
  filteredLocations: Lieu[] = [];
  displayedLocations: Lieu[] = [];
  isFiltersVisible = true;
  viewMode: 'grid' | 'map' = 'grid';
  previewLocation?: Lieu;
  activeCard?: number;

  filterForm!: FormGroup;
  maxPrice = 1000;
  allTypes: string[] = [];
  allAmenities: string[] = [];

  private map!: L.Map;
  private markers: L.Marker[] = [];
  private clusterGroup: any;

  pageSize = 12;
  currentPage = 1;

  private updatingUrl = false;

  isLoading = true;
  isLoadingMore = false;
  skeletonArray = Array.from({length: this.pageSize});
  activePhoto: Record<number,number> = {};
  private carouselTimers: Record<number, any> = {};
  @ViewChild('sentinel', { static:false }) sentinel?: ElementRef<HTMLElement>;

  constructor(private lieuService: LieuService, private fb: FormBuilder, private favs: FavoritesService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.locations = this.lieuService.getLieux();
    this.filteredLocations = [...this.locations];
    this.extractFilterOptions();

    this.filterForm = this.fb.group({
      maxPrice: [this.maxPrice],
      types: this.fb.group({}),
      minRating: [0],
      amenities: this.fb.group({})
    });

    this.buildCheckboxControls('types', this.allTypes);
    this.buildCheckboxControls('amenities', this.allAmenities);

    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
      this.syncUrl();
    });

    // delay initial display to show skeleton
    setTimeout(()=>{
      this.updateDisplayed();
      this.isLoading = false;
    }, 600);

    // init from URL after form created
    this.route.queryParams.subscribe(params => this.initFromParams(params));
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  ngAfterViewInit() {
    if(this.sentinel){
      const obs = new IntersectionObserver(entries=>{
        if(entries[0].isIntersecting && !this.isLoadingMore && this.displayedLocations.length < this.filteredLocations.length){
          this.loadMore();
        }
      }, { root:null, threshold:0.1 });
      obs.observe(this.sentinel.nativeElement);
    }
  }

  private extractFilterOptions(): void {
    const prices = this.locations.map(l => l.prix);
    this.maxPrice = Math.max(...prices);

    const types = this.locations.map(l => l.type);
    this.allTypes = [...new Set(types)];

    const amenities = this.locations.flatMap(l => l.equipements ?? []);
    this.allAmenities = [...new Set(amenities)];
  }

  private buildCheckboxControls(groupName: 'types' | 'amenities', options: string[]): void {
    const group = this.filterForm.get(groupName) as FormGroup;
    options.forEach(option => {
      group.addControl(option, this.fb.control(false));
    });
  }

  applyFilters(): void {
    const filters = this.filterForm.value;
    const selectedTypes = Object.keys(filters.types).filter(key => filters.types[key]);
    const selectedAmenities = Object.keys(filters.amenities).filter(key => filters.amenities[key]);

    this.filteredLocations = this.locations.filter(loc => {
      const priceMatch = loc.prix <= filters.maxPrice;
      const ratingMatch = loc.note >= filters.minRating;
      const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(loc.type);
      const amenitiesMatch = selectedAmenities.every(amenity => loc.equipements?.includes(amenity));

      return priceMatch && ratingMatch && typeMatch && amenitiesMatch;
    });

    this.currentPage = 1;
    this.updateDisplayed();

    if (this.viewMode === 'map' && this.map) {
      this.updateMarkers();
    }
  }

  resetFilters(): void {
    this.filterForm.reset({
      maxPrice: this.maxPrice,
      minRating: 0,
      types: {}, 
      amenities: {}
    });
    this.allTypes.forEach(type => this.filterForm.get('types')?.get(type)?.setValue(false, { emitEvent: false }));
    this.allAmenities.forEach(amenity => this.filterForm.get('amenities')?.get(amenity)?.setValue(false, { emitEvent: false }));
    this.applyFilters();
  }

  toggleFilters(): void {
    this.isFiltersVisible = !this.isFiltersVisible;
  }

  setViewMode(mode: 'grid' | 'map'): void {
    this.viewMode = mode;
    if (mode === 'map') {
      setTimeout(() => this.initMap(), 0);
    }
  }

  private initMap(): void {
    if (this.map) { return; }

    this.map = L.map('map').setView([46.2276, 2.2137], 6); // Center on France

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(this.map);

    this.updateMarkers();
  }

  private updateMarkers(): void {
    if (this.clusterGroup) { this.clusterGroup.remove(); }
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    if (this.filteredLocations.length === 0) { return; }

    const mcg = (L as any).markerClusterGroup ? (L as any).markerClusterGroup() : null;
    this.filteredLocations.forEach(loc => {
      const marker = L.marker([loc.lat, loc.lng]);
      const popupHtml = `<div style="max-width:220px"><img src='${loc.photos[0]}' style='width:100%;height:110px;object-fit:cover;border-radius:6px 6px 0 0'><div style='padding:6px'><strong>${loc.titre}</strong><br>${loc.prix}€ / nuit<br><a href='/lieux/${loc.id}'>Détails →</a></div></div>`;
      marker.bindPopup(popupHtml);
      this.markers.push(marker);
      if (mcg) mcg.addLayer(marker); else marker.addTo(this.map);
    });

    if (mcg) {
      this.clusterGroup = mcg.addTo(this.map);
      this.map.fitBounds(mcg.getBounds().pad(0.1));
    } else {
      const group = L.featureGroup(this.markers).addTo(this.map);
      this.map.fitBounds(group.getBounds().pad(0.1));
    }
  }

  private updateDisplayed() {
    this.displayedLocations = this.filteredLocations.slice(0, this.currentPage * this.pageSize);
  }

  loadMore() {
    if (this.isLoadingMore) return;
    this.isLoadingMore = true;
    setTimeout(()=>{
      this.currentPage++;
      this.updateDisplayed();
      this.isLoadingMore = false;
    }, 600);
  }

  toggleFav(id: number) { this.favs.toggle(id); }
  isFav(id: number) { return this.favs.isFavorite(id); }

  private buildQueryParams(): any {
    const filters = this.filterForm.value;
    const selectedTypes = Object.keys(filters.types).filter(k=>filters.types[k]);
    const selectedAmenities = Object.keys(filters.amenities).filter(k=>filters.amenities[k]);
    return {
      price: filters.maxPrice !== this.maxPrice ? filters.maxPrice : undefined,
      rating: filters.minRating || undefined,
      types: selectedTypes.length? selectedTypes.join(','): undefined,
      amenities: selectedAmenities.length? selectedAmenities.join(','): undefined
    };
  }

  private syncUrl() {
    if (this.updatingUrl) return;
    this.updatingUrl = true;
    this.router.navigate([], { relativeTo: this.route, queryParams: this.buildQueryParams(), queryParamsHandling: 'merge' }).finally(()=> this.updatingUrl=false);
  }

  private initFromParams(params:any) {
    if (this.updatingUrl) return;
    const patch:any = {};
    if(params['price']) patch.maxPrice = +params['price'];
    if(params['rating']) patch.minRating = +params['rating'];
    this.filterForm.patchValue(patch, {emitEvent:false});

    if(params['types']){
      const types=params['types'].split(',');
      types.forEach((t: string)=>{ if(this.filterForm.get('types.'+t)) this.filterForm.get('types.'+t)?.setValue(true,{emitEvent:false});});
    }
    if(params['amenities']){
      const a=params['amenities'].split(',');
      a.forEach((am: string)=>{ if(this.filterForm.get('amenities.'+am)) this.filterForm.get('amenities.'+am)?.setValue(true,{emitEvent:false});});
    }
    this.applyFilters();
  }

  getActiveFilterLabels(): {label:string,key:string}[] {
    const filters = this.filterForm.value;
    const badges: {label:string,key:string}[] = [];
    if(filters.maxPrice!==this.maxPrice) badges.push({label:`< ${filters.maxPrice}€`, key:'price'});
    if(filters.minRating>0) badges.push({label:`≥ ${filters.minRating}★`, key:'rating'});
    Object.keys(filters.types).filter(k=>filters.types[k]).forEach(t=>badges.push({label:t,key:'type:'+t}));
    Object.keys(filters.amenities).filter(k=>filters.amenities[k]).forEach(a=>badges.push({label:a,key:'amenity:'+a}));
    return badges;
  }
  
  getSelectedTypesCount(): number {
    const types = this.filterForm.get('types')?.value;
    return types ? Object.keys(types).filter(k => types[k]).length : 0;
  }
  
  getSelectedAmenitiesCount(): number {
    const amenities = this.filterForm.get('amenities')?.value;
    return amenities ? Object.keys(amenities).filter(k => amenities[k]).length : 0;
  }
  
  getTopFeatures(location: Lieu): string[] {
    // Return top 3 features/amenities for display in cards
    return (location.equipements || []).slice(0, 3);
  }
  
  nextPhoto(locationId: number, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const location = this.filteredLocations.find(loc => loc.id === locationId);
    if (!location) return;
    
    const total = location.photos.length;
    this.activePhoto[locationId] = ((this.activePhoto[locationId] ?? 0) + 1) % total;
  }
  
  prevPhoto(locationId: number, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    const location = this.filteredLocations.find(loc => loc.id === locationId);
    if (!location) return;
    
    const total = location.photos.length;
    this.activePhoto[locationId] = ((this.activePhoto[locationId] ?? 0) - 1 + total) % total;
  }

  removeFilter(badge:{label:string,key:string}){
    const k= badge.key;
    if(k==='price') this.filterForm.get('maxPrice')?.setValue(this.maxPrice);
    else if(k==='rating') this.filterForm.get('minRating')?.setValue(0);
    else if(k.startsWith('type:')) this.filterForm.get('types.'+k.slice(5))?.setValue(false);
    else if(k.startsWith('amenity:')) this.filterForm.get('amenities.'+k.slice(8))?.setValue(false);
  }

  showPreview(loc: Lieu) { this.previewLocation = loc; }
  closePreview() { this.previewLocation = undefined; }

  startCarousel(loc: Lieu){
    if(this.carouselTimers[loc.id]) return;
    this.activePhoto[loc.id]=0;
    this.carouselTimers[loc.id]=setInterval(()=>{
      const total = loc.photos.length;
      this.activePhoto[loc.id] = ((this.activePhoto[loc.id] ?? 0)+1)%total;
    },1500);
  }

  stopCarousel(loc: Lieu){
    if(this.carouselTimers[loc.id]){ clearInterval(this.carouselTimers[loc.id]); delete this.carouselTimers[loc.id]; }
    this.activePhoto[loc.id]=0;
  }
  
  navigateToDetail(id: number): void {
    // Set active card to show visual feedback before navigation
    this.activeCard = id;
    
    // Show preview on click instead of hover
    const location = this.filteredLocations.find(loc => loc.id === id);
    if (location) {
      this.showPreview(location);
      this.startCarousel(location);
    }
    
    // Navigate after a short delay to allow visual feedback
    setTimeout(() => {
      this.router.navigate(['/lieux', id]);
    }, 300);
  }
}
