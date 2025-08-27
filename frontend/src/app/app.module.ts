import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { routes } from './app.routes';

// Auth Module
import { AuthInterceptor, AuthErrorHandler } from './auth';

// Directives
import { ParallaxDirective, ParallaxGroupDirective } from './shared/animations/parallax.animation';

@NgModule({
  declarations: [
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 64],
      initialNavigation: 'enabledBlocking'
    }),
    ParallaxDirective,
    ParallaxGroupDirective
  ],
  providers: [
    // Auth Configuration
    {
      provide: ErrorHandler,
      useClass: AuthErrorHandler
    }
  ],
  bootstrap: []
})
export class AppModule { }
