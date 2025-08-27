import { NgModule, Optional, SkipSelf, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// Services
import { EnvironmentService } from './services/environment.service';
import { ThemeService } from '../shared/theme/theme.service';

// Interceptors
import { authInterceptor } from './interceptors/auth.interceptor';

// Error Handlers
import { AuthErrorHandler } from '../auth/auth-error.handler';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    EnvironmentService,
    ThemeService,
    {
      provide: ErrorHandler,
      useClass: AuthErrorHandler
    }
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only.'
      );
    }
  }
}