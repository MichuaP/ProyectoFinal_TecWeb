import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import {
  provideDatabase,
  getDatabase as getDatabase_alias,
} from '@angular/fire/database';
import { getDatabase } from 'firebase/database';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { environment } from '../environments/environment.development';
import { provideServiceWorker } from '@angular/service-worker';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideDatabase(() => getDatabase()),
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
],
};

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyD179Z4xtKE9BmEMkmDn8d_EkbBYOtI_yQ',
  authDomain: 'pruebafirebase-adf04.firebaseapp.com',
  projectId: 'pruebafirebase-adf04',
  storageBucket: 'pruebafirebase-adf04.appspot.com',
  messagingSenderId: '955848483561',
  appId: '1:955848483561:web:a9ef653cf92f876a25c678',
  measurementId: 'G-5LXF20CF5K',
};
