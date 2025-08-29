import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { v4 as uuid } from 'uuid';
import { TransactionService } from '../../core/services/transaction.service';
import { Transaction } from '../../core/models/transaction.model';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule
  ],
  template: `
    <h2 mat-dialog-title>Add {{ data?.type ?? 'transaction' }}</h2>
    <form [formGroup]="form" (ngSubmit)="save()" class="form">
      <mat-form-field appearance="outline">
        <mat-label>Description</mat-label>
        <input matInput formControlName="description" required />
        <mat-error *ngIf="form.get('description')?.invalid">Required</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Amount</mat-label>
        <input matInput type="number" formControlName="amount" required />
        <mat-error *ngIf="form.get('amount')?.invalid">> 0</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Category</mat-label>
        <mat-select formControlName="category" required>
          <mat-option *ngFor="let c of categories" [value]="c">{{ c }}</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Date</mat-label>
        <input matInput [matDatepicker]="picker" formControlName="date" required />
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Type</mat-label>
        <mat-select formControlName="type" required>
          <mat-option value="income">Income</mat-option>
          <mat-option value="expense">Expense</mat-option>
        </mat-select>
      </mat-form-field>

      <div class="actions">
        <button mat-button type="button" (click)="close()">Cancel</button>
        <button mat-flat-button color="primary" [disabled]="form.invalid">Save</button>
      </div>
    </form>
  `,
  styles: [`
    .form { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
    .actions { grid-column: 1 / -1; display: flex; justify-content: flex-end; gap: 10px; margin-top: 8px; }
  `]
})

export class TransactionFormComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Partial<Transaction>,
        private fb: FormBuilder,
        private ts: TransactionService,
        private ref: MatDialogRef<TransactionFormComponent>
    ) {
        this.form = this.fb.group({
            description: ['', Validators.required],
            amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
            category: ['', Validators.required],
            date: [new Date(), Validators.required],
            type: [data?.type ?? 'expense', Validators.required]
        });
    }

    //Hard coded
    categories = ['Food','Rent','Transport','Entertainment','Utilities','Shopping','Healthcare','Salary','Other'];

    form!: ReturnType<FormBuilder['group']>;

    save() {
        if (this.form.invalid) 
            return;
        const v = this.form.value;
        const trans: Transaction = {
            id: uuid(),
            description: v.description!,
            amount: Number(v.amount),
            category: v.category!,
            date: new Date(v.date as Date).toISOString().slice(0, 10),
            type: v.type as 'income' | 'expense'

        };
        this.ts.add(trans);
        close();
    }

    close() { 
        this.ref.close(); 
    }
}