import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // <-- Import this
import { appRoutes } from './app.routes';
import { authInterceptor } from './apps/dashboard/src/app/auth-interceptor'
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors([authInterceptor])), 

  ],
};