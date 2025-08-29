import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import 'zone.js';

//Firebase credentials
const firebaseConfig = {
  apiKey: import.meta.env['FIREBASE_API_KEY'],
  authDomain: import.meta.env['FIREBASE_AUTH_DOMAIN'],
  projectId: import.meta.env['FIREBASE_PROJECT_ID'],
  storageBucket: import.meta.env['FIREBASE_STORAGE_BUCKET'],
  messagingSenderId: import.meta.env['FIREBASE_MESSAGING_SENDER_ID'],
  appId: import.meta.env['FIREBASE_APP_ID'],
  measurementId: import.meta.env['FIREBASE_MEASUREMENT_ID']
};

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
}).catch(err => console.error(err));
