import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TransactionServiceLocal } from '../../core/services/transaction.service-local';
import { TransactionServiceFirebase } from '../../core/services/transaction.service-firebase';
import { TransactionFormComponent } from '../transactions/transaction-form.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="grid">
      <mat-card class="stat income">
        <div class="label">Income</div>
        <div class="value">{{ ts.incomeTotal() | currency }}</div>
      </mat-card>

      <mat-card class="stat expense">
        <div class="label">Expenses</div>
        <div class="value">{{ ts.expenseTotal() | currency }}</div>
      </mat-card>

      <mat-card class="stat balance">
        <div class="label">Balance</div>
        <div class="value">{{ ts.balance() | currency }}</div>
      </mat-card>
    </div>

    <div class="actions">
      <button mat-raised-button color="primary" (click)="openForm('income')">
        <mat-icon>add</mat-icon> Add Income
      </button>
      <button mat-raised-button color="warn" (click)="openForm('expense')">
        <mat-icon>remove</mat-icon> Add Expense
      </button>
    </div>
  `,
  styles: [`
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; }
    .stat { padding: 16px; }
    .label { opacity: .8; margin-bottom: 6px; }
    .value { font-size: 1.8rem; font-weight: 700; }
    .actions { margin-top: 20px; display: flex; gap: 12px; flex-wrap: wrap; }
  `]
})

export class DashboardComponent {
  ts = inject(TransactionServiceLocal);
  dialog = inject(MatDialog);

  openForm(defaultType: 'income' | 'expense') {
    this.dialog.open(TransactionFormComponent, { data: { type: defaultType } });
  }
}