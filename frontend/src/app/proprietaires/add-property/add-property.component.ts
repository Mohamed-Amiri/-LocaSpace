import { Component, OnInit, ChangeDetectorRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProprietairesService, Property } from '../services/proprietaires.service';
import { environment } from '../../../environments/environment';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatCheckboxModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatTooltipModule,
    DragDropModule
  ],
  templateUrl: './add-property.component.html',
  styleUrls: ['./add-property.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddPropertyComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  
  propertyForm: FormGroup;
  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  loading = false;

  // Validation System Properties
  validationScore = 0;
  completenessPercentage = 0;
  stepValidationStatus = {
    basicInfo: { isValid: false, completeness: 0, errors: [] as string[] },
    details: { isValid: false, completeness: 0, errors: [] as string[] },
    amenities: { isValid: false, completeness: 0, errors: [] as string[] },
    photos: { isValid: false, completeness: 0, errors: [] as string[] }
  };

  validationMessages = {
    basicInfo: {
      title: {
        required: 'Le titre est obligatoire',
        minlength: 'Le titre doit contenir au moins 5 caractères',
        suggestion: 'Utilisez un titre accrocheur pour attirer plus de voyageurs'
      },
      description: {
        required: 'La description est obligatoire',
        minlength: 'La description doit contenir au moins 20 caractères',
        suggestion: 'Plus de détails = plus de réservations'
      },
      propertyType: {
        required: 'Le type de propriété est obligatoire',
        suggestion: 'Choisissez le type qui correspond le mieux à votre bien'
      },
      location: {
        required: 'La localisation est obligatoire',
        minlength: 'Soyez plus précis sur la localisation',
        suggestion: 'Une localisation précise facilite les recherches'
      }
    },
    details: {
      maxGuests: {
        required: 'Le nombre d\'invités est obligatoire',
        min: 'Au moins 1 invité requis',
        suggestion: 'Indiquez la capacité réelle de votre logement'
      },
      bedrooms: {
        required: 'Le nombre de chambres est obligatoire',
        suggestion: 'Comptez toutes les chambres utilisables'
      },
      bathrooms: {
        required: 'Le nombre de salles de bain est obligatoire',
        min: 'Au moins 1 salle de bain requise',
        suggestion: 'Comptez toutes les salles de bain et toilettes'
      },
      price: {
        required: 'Le prix est obligatoire',
        min: 'Le prix minimum est de 10€',
        max: 'Le prix maximum est de 10 000€',
        suggestion: 'Consultez les prix similaires dans votre région'
      }
    }
  };

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

  amenityCategories = [
    {
      name: 'Équipements essentiels',
      icon: 'wifi',
      items: [
        { name: 'WiFi', icon: 'wifi' },
        { name: 'Climatisation', icon: 'ac_unit' },
        { name: 'Chauffage', icon: 'whatshot' },
        { name: 'Télévision', icon: 'tv' }
      ]
    },
    {
      name: 'Cuisine',
      icon: 'kitchen',
      items: [
        { name: 'Cuisine équipée', icon: 'kitchen' },
        { name: 'Lave-vaisselle', icon: 'kitchen' },
        { name: 'Micro-ondes', icon: 'kitchen' },
        { name: 'Lave-linge', icon: 'local_laundry_service' }
      ]
    },
    {
      name: 'Extérieur',
      icon: 'nature',
      items: [
        { name: 'Balcon', icon: 'balcony' },
        { name: 'Terrasse', icon: 'deck' },
        { name: 'Jardin', icon: 'grass' },
        { name: 'Piscine', icon: 'pool' }
      ]
    },
    {
      name: 'Confort',
      icon: 'spa',
      items: [
        { name: 'Parking', icon: 'local_parking' },
        { name: 'Ascenseur', icon: 'elevator' },
        { name: 'Jacuzzi', icon: 'hot_tub' },
        { name: 'Salle de sport', icon: 'fitness_center' }
      ]
    }
  ];

  isDragOver = false;

  constructor(
    private fb: FormBuilder,
    private proprietairesService: ProprietairesService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {
    this.propertyForm = this.createForm();
  }

  ngOnInit(): void {
    this.updateValidationStatus();
    this.setupFormValidationTracking();
  }

  private setupFormValidationTracking(): void {
    // Subscribe to form changes to update validation status in real-time
    this.propertyForm.valueChanges.subscribe(() => {
      this.updateValidationStatus();
    });

    // Subscribe to photos changes
    this.propertyForm.get('photos')?.valueChanges.subscribe(() => {
      this.updateValidationStatus();
    });
  }

  private createForm(): FormGroup {
    return this.fb.group({
      basicInfo: this.fb.group({
        title: ['', [Validators.required, Validators.minLength(5)]],
        description: ['', [Validators.required, Validators.minLength(20)]],
        propertyType: ['', Validators.required],
        location: ['', [Validators.required, Validators.minLength(10)]]
      }),
      details: this.fb.group({
        maxGuests: [1, [Validators.required, Validators.min(1)]],
        bedrooms: [1, [Validators.required, Validators.min(0)]],
        bathrooms: [1, [Validators.required, Validators.min(1)]],
        price: [0, [Validators.required, Validators.min(10), Validators.max(10000)]]
      }),
      amenities: this.fb.array([]),
      photos: this.fb.control([])
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
    this.processFiles(files);
  }

  removePhoto(index: number): void {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
    this.updateValidationStatus(); // Update validation after photo removal
  }

  onSubmit(event?: Event): void {
    // Prevent auto-submission unless we're on the final step (step 3 = Photos)
    if (this.stepper && this.stepper.selectedIndex !== 3) {
      event?.preventDefault();
      return;
    }
    
    if (this.propertyForm.valid) {
      this.loading = true;
      
      const formValue = this.propertyForm.value;
      const property: Omit<Property, 'id'> = {
        title: formValue.basicInfo.title,
        description: formValue.basicInfo.description,
        propertyType: formValue.basicInfo.propertyType,
        location: formValue.basicInfo.location,
        maxGuests: formValue.details.maxGuests,
        bedrooms: formValue.details.bedrooms,
        bathrooms: formValue.details.bathrooms,
        price: formValue.details.price,
        amenities: formValue.amenities,
        photos: [], // Will be updated after photo upload
        isActive: true,
        ownerId: 0 // Will be set by backend
      };

      console.log('Creating property with data:', property);
      console.log('API URL will be:', `${environment.apiUrl}/lieux`);

      this.proprietairesService.createProperty(property).subscribe({
        next: (createdProperty) => {
          // Ensure the manage page gets fresh data
          this.proprietairesService.refreshProperties();
          // Upload photos if selected
          if (this.selectedFiles.length > 0) {
            this.proprietairesService.uploadPropertyPhotos(createdProperty.id!, this.selectedFiles).subscribe({
              next: (urls) => {
                this.loading = false;
                this.cdr.detectChanges();
                this.snackBar.open('Propriété créée avec succès!', 'Fermer', { duration: 3000 });
                this.router.navigate(['/proprietaires/manage-properties']);
              },
              error: (error) => {
                console.error('Error uploading photos:', error);
                this.loading = false;
                this.cdr.detectChanges();
                this.snackBar.open('Propriété créée mais erreur lors du téléchargement des photos', 'Fermer', { duration: 5000 });
                this.router.navigate(['/proprietaires/manage-properties']);
              }
            });
          } else {
            this.loading = false;
            this.cdr.detectChanges();
            this.snackBar.open('Propriété créée avec succès!', 'Fermer', { duration: 3000 });
            this.router.navigate(['/proprietaires/manage-properties']);
          }
        },
        error: (error) => {
          console.error('Error creating property:', error);
          console.error('Error details:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            url: error.url,
            error: error.error
          });
          this.loading = false;
          this.cdr.detectChanges();
          let errorMessage = 'Erreur lors de la création de la propriété';
          if (error.status === 401) {
            errorMessage = 'Non autorisé - Veuillez vous reconnecter';
          } else if (error.status === 403) {
            errorMessage = 'Accès refusé';
          } else if (error.status === 404) {
            errorMessage = 'Service non trouvé - Vérifiez que le backend est démarré';
          } else if (error.status === 500) {
            errorMessage = 'Erreur serveur - Vérifiez les logs du backend';
          } else if (error.status === 0) {
            errorMessage = 'Impossible de contacter le serveur - Vérifiez que le backend est démarré sur le port 8082';
          }
          this.snackBar.open(errorMessage, 'Fermer', { duration: 5000 });
        }
      });
    } else {
      this.markFormGroupTouched();
      this.snackBar.open('Veuillez remplir tous les champs requis', 'Fermer', { duration: 3000 });
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.propertyForm.controls).forEach(key => {
      const control = this.propertyForm.get(key);
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach(nestedKey => {
          control.get(nestedKey)?.markAsTouched();
        });
      } else {
        control?.markAsTouched();
      }
    });
  }

  // Validation System Methods
  private updateValidationStatus(): void {
    this.validateBasicInfo();
    this.validateDetails();
    this.validateAmenities();
    this.validatePhotos();
    this.calculateOverallCompleteness();
  }

  private validateBasicInfo(): void {
    const basicInfo = this.propertyForm.get('basicInfo');
    if (!basicInfo) return;

    const errors: string[] = [];
    let completeness = 0;
    const totalFields = 4;

    // Title validation
    const title = basicInfo.get('title');
    if (title?.value && title.value.length >= 5) {
      completeness += 0.25;
    } else if (title?.errors) {
      if (title.errors['required']) errors.push(this.validationMessages.basicInfo.title.required);
      if (title.errors['minlength']) errors.push(this.validationMessages.basicInfo.title.minlength);
    }

    // Description validation
    const description = basicInfo.get('description');
    if (description?.value && description.value.length >= 20) {
      completeness += 0.25;
    } else if (description?.errors) {
      if (description.errors['required']) errors.push(this.validationMessages.basicInfo.description.required);
      if (description.errors['minlength']) errors.push(this.validationMessages.basicInfo.description.minlength);
    }

    // Property type validation
    const propertyType = basicInfo.get('propertyType');
    if (propertyType?.value) {
      completeness += 0.25;
    } else if (propertyType?.errors?.['required']) {
      errors.push(this.validationMessages.basicInfo.propertyType.required);
    }

    // Location validation
    const location = basicInfo.get('location');
    if (location?.value && location.value.length >= 10) {
      completeness += 0.25;
    } else if (location?.errors) {
      if (location.errors['required']) errors.push(this.validationMessages.basicInfo.location.required);
      if (location.errors['minlength']) errors.push(this.validationMessages.basicInfo.location.minlength);
    }

    this.stepValidationStatus.basicInfo = {
      isValid: basicInfo.valid,
      completeness: completeness * 100,
      errors
    };
  }

  private validateDetails(): void {
    const details = this.propertyForm.get('details');
    if (!details) return;

    const errors: string[] = [];
    let completeness = 0;
    const totalFields = 4;

    // Max guests validation
    const maxGuests = details.get('maxGuests');
    if (maxGuests?.value && maxGuests.value >= 1) {
      completeness += 0.25;
    } else if (maxGuests?.errors) {
      if (maxGuests.errors['required']) errors.push(this.validationMessages.details.maxGuests.required);
      if (maxGuests.errors['min']) errors.push(this.validationMessages.details.maxGuests.min);
    }

    // Bedrooms validation
    const bedrooms = details.get('bedrooms');
    if (bedrooms?.value !== null && bedrooms?.value >= 0) {
      completeness += 0.25;
    } else if (bedrooms?.errors?.['required']) {
      errors.push(this.validationMessages.details.bedrooms.required);
    }

    // Bathrooms validation
    const bathrooms = details.get('bathrooms');
    if (bathrooms?.value && bathrooms.value >= 1) {
      completeness += 0.25;
    } else if (bathrooms?.errors) {
      if (bathrooms.errors['required']) errors.push(this.validationMessages.details.bathrooms.required);
      if (bathrooms.errors['min']) errors.push(this.validationMessages.details.bathrooms.min);
    }

    // Price validation
    const price = details.get('price');
    if (price?.value && price.value >= 10 && price.value <= 10000) {
      completeness += 0.25;
    } else if (price?.errors) {
      if (price.errors['required']) errors.push(this.validationMessages.details.price.required);
      if (price.errors['min']) errors.push(this.validationMessages.details.price.min);
      if (price.errors['max']) errors.push(this.validationMessages.details.price.max);
    }

    this.stepValidationStatus.details = {
      isValid: details.valid,
      completeness: completeness * 100,
      errors
    };
  }

  private validateAmenities(): void {
    const amenitiesArray = this.amenitiesFormArray;
    const amenitiesCount = amenitiesArray.length;
    
    let completeness = 0;
    let isValid = true;
    const errors: string[] = [];

    if (amenitiesCount === 0) {
      completeness = 0;
      errors.push('Ajoutez au moins quelques équipements pour attirer plus de voyageurs');
      isValid = false;
    } else if (amenitiesCount < 3) {
      completeness = 30;
      errors.push('Ajoutez plus d\'équipements pour améliorer votre annonce');
    } else if (amenitiesCount < 6) {
      completeness = 70;
    } else {
      completeness = 100;
    }

    this.stepValidationStatus.amenities = {
      isValid: amenitiesCount >= 1,
      completeness,
      errors
    };
  }

  private validatePhotos(): void {
    const photosCount = this.previewUrls.length;
    
    let completeness = 0;
    let isValid = true;
    const errors: string[] = [];

    if (photosCount === 0) {
      completeness = 0;
      errors.push('Ajoutez au moins une photo pour créer votre annonce');
      isValid = false;
    } else if (photosCount < 3) {
      completeness = 40;
      errors.push('Ajoutez plus de photos pour augmenter vos réservations de 40%');
    } else if (photosCount < 5) {
      completeness = 70;
    } else {
      completeness = 100;
    }

    this.stepValidationStatus.photos = {
      isValid: photosCount >= 1,
      completeness,
      errors
    };
  }

  private calculateOverallCompleteness(): void {
    const steps = Object.values(this.stepValidationStatus);
    const averageCompleteness = steps.reduce((sum, step) => sum + step.completeness, 0) / steps.length;
    
    this.completenessPercentage = Math.round(averageCompleteness);
    
    // Calculate validation score (weighted)
    this.validationScore = Math.round(
      (this.stepValidationStatus.basicInfo.completeness * 0.3) +
      (this.stepValidationStatus.details.completeness * 0.25) +
      (this.stepValidationStatus.amenities.completeness * 0.2) +
      (this.stepValidationStatus.photos.completeness * 0.25)
    );
  }

  // Getter methods for template
  getStepIcon(stepName: keyof typeof this.stepValidationStatus): string {
    const step = this.stepValidationStatus[stepName];
    if (step.completeness === 100) return 'check_circle';
    if (step.completeness >= 70) return 'check_circle_outline';
    if (step.completeness >= 30) return 'info';
    return 'warning';
  }

  getStepIconColor(stepName: keyof typeof this.stepValidationStatus): string {
    const step = this.stepValidationStatus[stepName];
    if (step.completeness === 100) return 'success';
    if (step.completeness >= 70) return 'primary';
    if (step.completeness >= 30) return 'accent';
    return 'warn';
  }

  getOverallValidationClass(): string {
    if (this.validationScore >= 90) return 'excellent';
    if (this.validationScore >= 70) return 'good';
    if (this.validationScore >= 50) return 'fair';
    return 'needs-improvement';
  }

  getValidationMessage(): string {
    if (this.validationScore >= 90) return 'Excellent ! Votre annonce est prête à attirer de nombreux voyageurs.';
    if (this.validationScore >= 70) return 'Très bien ! Quelques améliorations et votre annonce sera parfaite.';
    if (this.validationScore >= 50) return 'Bien ! Continuez à compléter votre annonce.';
    return 'Besoin d\'améliorations pour optimiser votre annonce.';
  }

  getAllErrors(): string[] {
    const allErrors: string[] = [];
    Object.values(this.stepValidationStatus).forEach(step => {
      allErrors.push(...step.errors);
    });
    return allErrors;
  }

  getStepTooltip(step: string): string {
    const stepStatus = this.stepValidationStatus[step as keyof typeof this.stepValidationStatus];
    if (stepStatus.completeness === 100) {
      return `Étape complète ! (${stepStatus.completeness}%)`;
    }
    return `Étape à ${stepStatus.completeness}% - ${stepStatus.errors[0] || 'Continuez votre saisie'}`;
  }

  getStepName(step: string): string {
    const names: { [key: string]: string } = {
      basicInfo: 'Infos',
      details: 'Détails',
      amenities: 'Équipements',
      photos: 'Photos'
    };
    return names[step] || step;
  }

  getStepKeys(): (keyof typeof this.stepValidationStatus)[] {
    return ['basicInfo', 'details', 'amenities', 'photos'];
  }

  cancel(): void {
    this.router.navigate(['/proprietaires/dashboard']);
  }

  // Navigation method for custom stepper
  goToStep(index: number): void {
    if (this.stepper) {
      this.stepper.selectedIndex = index;
    }
  }

  // Prevent Enter key from auto-submitting form
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.stepper && this.stepper.selectedIndex !== 3) {
      event.preventDefault();
      // Optional: Move to next step instead
      // this.goToStep(this.stepper.selectedIndex + 1);
    }
  }

  // New utility methods for enhanced UI
  getProgressPercentage(): number {
    const currentStep = (document.querySelector('mat-stepper') as any)?._selectedIndex || 0;
    return ((currentStep + 1) / 4) * 100;
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

  toggleAmenity(amenity: string): void {
    const amenitiesArray = this.amenitiesFormArray;
    const index = amenitiesArray.controls.findIndex(x => x.value === amenity);
    
    if (index >= 0) {
      amenitiesArray.removeAt(index);
    } else {
      amenitiesArray.push(this.fb.control(amenity));
    }
  }

  // Enhanced photo management
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    const files = Array.from(event.dataTransfer?.files || []) as File[];
    this.processFiles(files);
  }

  onPhotoReorder(event: any): void {
    const previousIndex = event.previousIndex;
    const currentIndex = event.currentIndex;
    
    // Reorder both arrays
    const movedFile = this.selectedFiles.splice(previousIndex, 1)[0];
    const movedUrl = this.previewUrls.splice(previousIndex, 1)[0];
    
    this.selectedFiles.splice(currentIndex, 0, movedFile);
    this.previewUrls.splice(currentIndex, 0, movedUrl);
  }

  setMainPhoto(index: number): void {
    // Move selected photo to first position
    const movedFile = this.selectedFiles.splice(index, 1)[0];
    const movedUrl = this.previewUrls.splice(index, 1)[0];
    
    this.selectedFiles.unshift(movedFile);
    this.previewUrls.unshift(movedUrl);
  }

  getFileSize(index: number): string {
    if (this.selectedFiles[index]) {
      const bytes = this.selectedFiles[index].size;
      const mb = bytes / 1024 / 1024;
      return `${mb.toFixed(1)} MB`;
    }
    return '';
  }

  private processFiles(files: File[]): void {
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

    // Check total limit
    if (this.selectedFiles.length + validFiles.length > 10) {
      this.snackBar.open('Maximum 10 photos autorisées', 'Fermer', { duration: 3000 });
      return;
    }

    this.selectedFiles = [...this.selectedFiles, ...validFiles];
    
    // Generate preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrls.push(e.target?.result as string);
        this.updateValidationStatus(); // Update validation after each photo is loaded
      };
      reader.readAsDataURL(file);
    });
  }
}