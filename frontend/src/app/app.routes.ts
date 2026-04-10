import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'market',
    loadComponent: () =>
      import('./market/market.component').then(m => m.MarketComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
