import { Component, ViewChild, inject, signal, computed, effect } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TransactionService } from '../../core/services/transaction.service';
import { TransactionFormComponent } from './transaction-form.component';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatSortModule, MatPaginatorModule, MatFormFieldModule,
    MatInputModule, MatIconModule, MatButtonModule, MatDialogModule, DatePipe, CurrencyPipe
  ],
  template: `
    <div class="header">
      <mat-form-field appearance="outline" class="filter">
        <mat-label>Search</mat-label>
        <input matInput (input)="applyFilter($event)" placeholder="description, category..." />
      </mat-form-field>
      <button mat-flat-button color="primary" (click)="openForm()">
        <mat-icon>add</mat-icon> Add Transaction
      </button>
    </div>

    <table mat-table [dataSource]="filtered()" matSort class="mat-elevation-z1">
      <ng-container matColumnDef="date">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
        <td mat-cell *matCellDef="let t">{{ t.date | date:'mediumDate' }}</td>
      </ng-container>

      <ng-container matColumnDef="description">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Description</th>
        <td mat-cell *matCellDef="let t">{{ t.description }}</td>
      </ng-container>

      <ng-container matColumnDef="category">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Category</th>
        <td mat-cell *matCellDef="let t">{{ t.category }}</td>
      </ng-container>

      <ng-container matColumnDef="type">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Type</th>
        <td mat-cell *matCellDef="let t">{{ t.type }}</td>
      </ng-container>

      <ng-container matColumnDef="amount">
        <th mat-header-cell *matHeaderCellDef mat-sort-header>Amount</th>
        <td mat-cell *matCellDef="let t">
          <span [style.color]="t.type === 'expense' ? 'crimson' : 'seagreen'">
            {{ (t.type === 'expense' ? -t.amount : t.amount) | currency }}
          </span>
        </td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let t">
          <button mat-icon-button color="warn" (click)="remove(t.id)"><mat-icon>delete</mat-icon></button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="cols"></tr>
      <tr mat-row *matRowDef="let row; columns: cols;"></tr>
    </table>

    <mat-paginator [pageSize]="10" [pageSizeOptions]="[5,10,25]" />
  `,
  styles: [`
    .header { display: flex; gap: 12px; align-items: center; margin-bottom: 12px; }
    .filter { flex: 1; }
    table { width: 100%; }
  `]
})

export class TransactionListComponent {
    ts = inject(TransactionService)
    dialog = inject(MatDialog);

    cols = ['date','description','category','type','amount','actions'] as const;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;

    query = signal('');
    filtered = computed(() => {
        const q = this.query().toLowerCase().trim();
        const items = [...this.ts.transactions()].sort((a,b)=> a.date < b.date ? 1 : -1);
        if (!q) return items;
        return items.filter(t =>
        [t.description, t.category, t.type, String(t.amount), t.date].some(v => v.toLowerCase().includes(q))
        );
    });

    applyFilter(ev: Event) {
        const val = (ev.target as HTMLInputElement).value ?? '';
        this.query.set(val);
    }

    remove(id: string) { 
        this.ts.remove(id); 
    }

    openForm() { 
        this.dialog.open(TransactionFormComponent); 
    }
}