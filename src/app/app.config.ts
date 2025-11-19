import { ApplicationConfig } from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import {provideHttpClient, withInterceptors, withInterceptorsFromDi} from "@angular/common/http";
import {authInterceptor} from "./core/interceptors/auth.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideStore(),
    provideEffects(),
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withInterceptorsFromDi()
    )
  ]
};
