import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TransactionListComponent } from './features/transactions/transaction-list.component';
import { ChartsComponent } from './features/charts/charts.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent, title: 'Budget Dashboard' },
  { path: 'transactions', component: TransactionListComponent, title: 'Transactions' },
  { path: 'charts', component: ChartsComponent, title: 'Charts' },
  { path: '**', redirectTo: '' }
];