import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Material Modules
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressBarModule } from '@angular/material/progress-bar';

// Components - Most are now standalone, so imports removed
// Only import components that exist and are needed by this module
// import { TabsComponent } from './components/tabs/tabs.component';
// Note: FormComponent and other missing components/directives/pipes are commented out
// until they are created or converted to standalone components

// Directives - commented out until created
// import { ClickOutsideDirective } from './directives/click-outside.directive';
// import { ScrollTrackingDirective } from './directives/scroll-tracking.directive';
// import { LazyLoadDirective } from './directives/lazy-load.directive';
// import { DragDropDirective } from './directives/drag-drop.directive';
// import { ResizeObserverDirective } from './directives/resize-observer.directive';
// import { IntersectionObserverDirective } from './directives/intersection-observer.directive';
// import { RippleDirective } from './directives/ripple.directive';
// import { DebounceClickDirective } from './directives/debounce-click.directive';

// Pipes - commented out until created
// import { SafeHtmlPipe } from './pipes/safe-html.pipe';
// import { FileSizePipe } from './pipes/file-size.pipe';
// import { TimeAgoPipe } from './pipes/time-ago.pipe';
// import { TruncatePipe } from './pipes/truncate.pipe';
// import { CurrencyFormatPipe } from './pipes/currency-format.pipe';
// import { PhoneFormatPipe } from './pipes/phone-format.pipe';
// import { HighlightPipe } from './pipes/highlight.pipe';

@NgModule({
  declarations: [
    // All components are now standalone, so no declarations needed
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatMenuModule,
    MatTooltipModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatBadgeModule,
    MatProgressBarModule
  ],
  exports: [
    // Only exporting components that are declared in this module
    // Material modules for convenience
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatMenuModule,
    MatTooltipModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatBadgeModule,
    MatProgressBarModule
  ]
})
export class SharedModule {}