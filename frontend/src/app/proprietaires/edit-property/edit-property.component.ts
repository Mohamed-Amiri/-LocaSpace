import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ToastService } from '../../shared/components/toast/toast.service';
import { ProprietairesService, Property } from '../services/proprietaires.service';

@Component({
  selector: 'app-edit-property',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
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
    private toastService: ToastService,
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
        this.toastService.error('Erreur lors du chargement de la propriété');
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

    this.currentPhotos = [...property.photos];

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
    
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/');
      const isValidSize = file.size <= 5 * 1024 * 1024;
      
      if (!isValidType) {
        this.toastService.error('Seuls les fichiers image sont acceptés');
        return false;
      }
      
      if (!isValidSize) {
        this.toastService.error('La taille du fichier ne doit pas dépasser 5MB');
        return false;
      }
      
      return true;
    });

    this.selectedFiles = [...this.selectedFiles, ...validFiles];
    
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
        this.toastService.error('Erreur lors de la suppression de la photo');
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
        this.toastService.error('Erreur lors du réordonnancement des photos');
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

  toggleAmenity(amenity: string): void {
    const isSelected = this.isAmenitySelected(amenity);
    this.onAmenityChange(amenity, !isSelected);
  }

  getAmenityIcon(amenity: string): string {
    const iconMap: { [key: string]: string } = {
      'WiFi': 'wifi',
      'Climatisation': 'snowflake',
      'Chauffage': 'fire',
      'Cuisine équipée': 'utensils',
      'Lave-vaisselle': 'sink',
      'Lave-linge': 'tshirt',
      'Sèche-linge': 'wind',
      'Télévision': 'tv',
      'Parking': 'parking',
      'Balcon': 'door-open',
      'Terrasse': 'umbrella-beach',
      'Jardin': 'leaf',
      'Piscine': 'swimming-pool',
      'Jacuzzi': 'hot-tub',
      'Salle de sport': 'dumbbell',
      'Ascenseur': 'elevator',
      'Animaux acceptés': 'paw',
      'Non-fumeur': 'smoking-ban'
    };
    return iconMap[amenity] || 'check-circle';
  }

  removeCurrentPhoto(index: number): void {
    this.currentPhotos.splice(index, 1);
  }

  removeNewPhoto(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
  }

  onSubmit(): void {
    if (this.propertyForm.valid) {
      this.saving = true;
      
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
        photos: this.currentPhotos
      };

      this.proprietairesService.updateProperty(this.propertyId, updatedProperty).subscribe({
        next: () => {
          if (this.selectedFiles.length > 0) {
            this.proprietairesService.uploadPropertyPhotos(this.propertyId, this.selectedFiles).subscribe({
              next: () => {
                this.saving = false;
                this.toastService.success('Propriété mise à jour avec succès!');
                this.router.navigate(['/proprietaires/manage-properties']);
              },
              error: (error) => {
                console.error('Error uploading photos:', error);
                this.saving = false;
                this.toastService.error('Propriété mise à jour mais erreur lors du téléchargement des photos');
                this.router.navigate(['/proprietaires/manage-properties']);
              }
            });
          } else {
            this.saving = false;
            this.toastService.success('Propriété mise à jour avec succès!');
            this.router.navigate(['/proprietaires/manage-properties']);
          }
        },
        error: (error) => {
          console.error('Error updating property:', error);
          this.saving = false;
          this.toastService.error('Erreur lors de la mise à jour de la propriété');
        }
      });
    } else {
      this.markFormGroupTouched();
      this.toastService.error('Veuillez corriger les erreurs du formulaire');
    }
  }
}