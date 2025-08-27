import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RouterModule } from '@angular/router';
import { ProprietairesService, Property } from '../services/proprietaires.service';

@Component({
  selector: 'app-edit-property',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
    MatTooltipModule,
    MatSlideToggleModule
  ],
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.scss']
})
export class EditPropertyComponent implements OnInit {
  propertyForm: FormGroup;
  property: Property | null = null;
  propertyId: number;
  loading = true;
  saving = false;
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  currentPhotos: string[] = [];

  propertyTypes = [
    { value: 'apartment', label: 'Appartement' },
    { value: 'house', label: 'Maison' },
    { value: 'villa', label: 'Villa' },
    { value: 'studio', label: 'Studio' },
    { value: 'loft', label: 'Loft' },
    { value: 'chalet', label: 'Chalet' }
  ];

  availableAmenities = [
    'WiFi', 'Climatisation', 'Chauffage', 'Cuisine équipée', 'Lave-vaisselle',
    'Lave-linge', 'Sèche-linge', 'Télévision', 'Parking', 'Balcon',
    'Terrasse', 'Jardin', 'Piscine', 'Jacuzzi', 'Salle de sport',
    'Ascenseur', 'Animaux acceptés', 'Non-fumeur'
  ];

  constructor(
    private fb: FormBuilder,
    private proprietairesService: ProprietairesService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.propertyId = +this.route.snapshot.params['id'];
    this.propertyForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadProperty();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      propertyType: ['', Validators.required],
      location: ['', Validators.required],
      maxGuests: [1, [Validators.required, Validators.min(1)]],
      bedrooms: [1, [Validators.required, Validators.min(0)]],
      bathrooms: [1, [Validators.required, Validators.min(1)]],
      price: [0, [Validators.required, Validators.min(1)]],
      amenities: this.fb.array([]),
      isActive: [true]
    });
  }

  private loadProperty(): void {
    this.proprietairesService.getPropertyById(this.propertyId).subscribe({
      next: (property) => {
        this.property = property;
        this.populateForm(property);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading property:', error);
        this.loading = false;
        this.snackBar.open('Erreur lors du chargement de la propriété', 'Fermer', { duration: 3000 });
        this.router.navigate(['/proprietaires/manage-properties']);
        this.cdr.detectChanges();
      }
    });
  }

  private populateForm(property: Property): void {
    this.propertyForm.patchValue({
      title: property.title,
      description: property.description,
      propertyType: property.propertyType,
      location: property.location,
      maxGuests: property.maxGuests,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      price: property.price,
      isActive: property.isActive
    });

    // Set current photos
    this.currentPhotos = [...property.photos];

    // Set amenities
    const amenitiesArray = this.amenitiesFormArray;
    amenitiesArray.clear();
    property.amenities.forEach(amenity => {
      amenitiesArray.push(this.fb.control(amenity));
    });
  }

  get amenitiesFormArray(): FormArray {
    return this.propertyForm.get('amenities') as FormArray;
  }

  onAmenityChange(amenity: string, checked: boolean): void {
    const amenitiesArray = this.amenitiesFormArray;
    
    if (checked) {
      amenitiesArray.push(this.fb.control(amenity));
    } else {
      const index = amenitiesArray.controls.findIndex(x => x.value === amenity);
      if (index >= 0) {
        amenitiesArray.removeAt(index);
      }
    }
  }

  isAmenitySelected(amenity: string): boolean {
    return this.amenitiesFormArray.controls.some(control => control.value === amenity);
  }

  onFilesSelected(event: any): void {
    const files = Array.from(event.target.files) as File[];
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
      
      if (!isValidType) {
        this.snackBar.open('Seuls les fichiers image sont acceptés', 'Fermer', { duration: 3000 });
        return false;
      }
      
      if (!isValidSize) {
        this.snackBar.open('La taille du fichier ne doit pas dépasser 5MB', 'Fermer', { duration: 3000 });
        return false;
      }
      
      return true;
    });

    this.selectedFiles = [...this.selectedFiles, ...validFiles];
    
    // Generate preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrls.push(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  removePhoto(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  removeExistingPhoto(index: number): void {
    if (!this.property) return;
    const url = this.property.photos[index];
    this.proprietairesService.deletePropertyPhoto(this.propertyId, url).subscribe({
      next: () => {
        this.property!.photos.splice(index, 1);
      },
      error: (error) => {
        console.error('Error deleting photo:', error);
        this.snackBar.open('Erreur lors de la suppression de la photo', 'Fermer', { duration: 3000 });
      }
    });
  }

  movePhoto(previousIndex: number, newIndex: number): void {
    if (!this.property) return;
    const photos = [...this.property.photos];
    const [moved] = photos.splice(previousIndex, 1);
    photos.splice(newIndex, 0, moved);
    this.proprietairesService.reorderPropertyPhotos(this.propertyId, photos).subscribe({
      next: () => {
        this.property!.photos = photos;
      },
      error: (error) => {
        console.error('Error reordering photos:', error);
        this.snackBar.open('Erreur lors du réordonnancement des photos', 'Fermer', { duration: 3000 });
      }
    });
  }



  private markFormGroupTouched(): void {
    Object.keys(this.propertyForm.controls).forEach(key => {
      const control = this.propertyForm.get(key);
      control?.markAsTouched();
    });
  }

  cancel(): void {
    this.router.navigate(['/proprietaires/manage-properties']);
  }

  // New methods for the premium template
  toggleAmenity(amenity: string): void {
    const isSelected = this.isAmenitySelected(amenity);
    this.onAmenityChange(amenity, !isSelected);
  }

  getAmenityIcon(amenity: string): string {
    const iconMap: { [key: string]: string } = {
      'WiFi': 'wifi',
      'Climatisation': 'ac_unit',
      'Chauffage': 'local_fire_department',
      'Cuisine équipée': 'kitchen',
      'Lave-vaisselle': 'dishwasher',
      'Lave-linge': 'local_laundry_service',
      'Sèche-linge': 'dry',
      'Télévision': 'tv',
      'Parking': 'local_parking',
      'Balcon': 'balcony',
      'Terrasse': 'deck',
      'Jardin': 'grass',
      'Piscine': 'pool',
      'Jacuzzi': 'hot_tub',
      'Salle de sport': 'fitness_center',
      'Ascenseur': 'elevator',
      'Animaux acceptés': 'pets',
      'Non-fumeur': 'smoke_free'
    };
    return iconMap[amenity] || 'check_circle';
  }

  removeCurrentPhoto(index: number): void {
    this.currentPhotos.splice(index, 1);
  }

  removeNewPhoto(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  // Update the onSubmit method to include isActive
  onSubmit(): void {
    if (this.propertyForm.valid) {
      this.loading = true;
      
      const formValue = this.propertyForm.value;
      const updatedProperty: Partial<Property> = {
        title: formValue.title,
        description: formValue.description,
        propertyType: formValue.propertyType,
        location: formValue.location,
        maxGuests: formValue.maxGuests,
        bedrooms: formValue.bedrooms,
        bathrooms: formValue.bathrooms,
        price: formValue.price,
        amenities: formValue.amenities,
        isActive: formValue.isActive,
        photos: this.currentPhotos // Update with current photos
      };

      this.proprietairesService.updateProperty(this.propertyId, updatedProperty).subscribe({
        next: (updated) => {
          // Upload new photos if any
          if (this.selectedFiles.length > 0) {
            this.proprietairesService.uploadPropertyPhotos(this.propertyId, this.selectedFiles).subscribe({
              next: (photoUrls) => {
                this.loading = false;
                this.snackBar.open('Propriété mise à jour avec succès!', 'Fermer', { duration: 3000 });
                this.router.navigate(['/proprietaires/manage-properties']);
              },
              error: (error) => {
                console.error('Error uploading photos:', error);
                this.loading = false;
                this.snackBar.open('Propriété mise à jour mais erreur lors du téléchargement des photos', 'Fermer', { duration: 5000 });
                this.router.navigate(['/proprietaires/manage-properties']);
              }
            });
          } else {
            this.loading = false;
            this.snackBar.open('Propriété mise à jour avec succès!', 'Fermer', { duration: 3000 });
            this.router.navigate(['/proprietaires/manage-properties']);
          }
        },
        error: (error) => {
          console.error('Error updating property:', error);
          this.loading = false;
          this.snackBar.open('Erreur lors de la mise à jour de la propriété', 'Fermer', { duration: 3000 });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }
}