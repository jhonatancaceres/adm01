import { Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';
import { BalanceComponent } from './portfolio/components/balance/balance.component';
import { PortfolioComponent } from './portfolio/components/portfolio/portfolio.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    redirectTo: 'home'
  },
  {
    path: 'home',
    component: HomeComponent,
    title: 'Home page'
  }
  ,
  {
    path: 'balance',
    component: BalanceComponent,
    title: 'Balance page'
  },
  {
    path: 'portfolio',
    children: [
      {
        path: '',
        component: PortfolioComponent,
      },
      {
        path: ':p',
        component: PortfolioComponent,
        

      }
    ]
  }
];
