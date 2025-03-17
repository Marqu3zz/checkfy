import {ApplicationConfig, provideZoneChangeDetection} from "@angular/core";
import {routes} from "./app.routes";
import {provideRouter, withComponentInputBinding} from "@angular/router";
import {provideAnimationsAsync} from "@angular/platform-browser/animations/async";
import {provideHttpClient, withFetch} from "@angular/common/http";


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideAnimationsAsync(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch())
  ]
};
