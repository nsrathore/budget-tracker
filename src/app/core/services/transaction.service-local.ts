import { Injectable, computed, signal } from '@angular/core';
import { Transaction } from '../models/transaction.model';

const LS_KEY = 'bt_transactions_v1';

@Injectable({ providedIn: 'root'})
export class TransactionService {
    private _transactions = signal<Transaction[]>(this.load());
    transactions = computed(() => this._transactions());

    incomeTotal = computed(() => this._transactions().filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0));
    expenseTotal = computed(() => this._transactions().filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0));
    balance = computed(() => this.incomeTotal() - this.expenseTotal());

    add(trans: Transaction) {
        this._transactions.update(list => {
            const next = [...list, trans];
            this.save(next);
            return next;
        });
    }

    update(id: string, patch: Partial<Transaction>) {
        this._transactions.update(list => {
            const next = list.map(t => t.id === id ? {...t, ...patch} : t)
            this.save(next);
            return next;
        });
    }

    remove(id: string) {
        this._transactions.update(list => {
            const next = list.filter(t => t.id != id);
            this.save(next);
            return next;
        });
    }

    import(transactions: Transaction[]) {
        this.save(transactions);
        this._transactions.set(transactions);
    }

    export(): string {
        return JSON.stringify(this._transactions(), null, 2);
    }

    //Helper functions
    private load(): Transaction[] {
        try {
            const item = localStorage.getItem(LS_KEY);
            return item ? JSON.parse(item) as Transaction[] : []
        }
        catch {
            return [];
        }
    }

    private save(transaction: Transaction[]) {
        localStorage.setItem(LS_KEY, JSON.stringify(transaction));
    }
}