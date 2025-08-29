import { Injectable, computed, signal } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc, getDoc } from '@angular/fire/firestore';
import { Observable, combineLatest, map, of } from 'rxjs';


@Injectable({ providedIn: 'root'})
export class TransactionServiceFirebase {
    private transactionsRef;

    constructor(private firestore: Firestore) {
        // Reference to the "transactions" collection in Firestore
        this.transactionsRef = collection(this.firestore, 'transactions');
    }

    incomeTotal = this.getIncomeTotal();
    expenseTotal = this.getExpenseTotal();
    balance = combineLatest([this.incomeTotal, this.expenseTotal]).pipe(map(([a, b]) => a - b));

    /**
     * Add a new transaction to Firestore
     */
    addFirebase(transaction: Transaction) {
        return addDoc(this.transactionsRef, transaction);
    }

    /**
     * Get all transactions (live updates via RxJS Observable)
     */
    getAllFirebase(): Observable<Transaction[]> {
        return collectionData(this.transactionsRef, { idField: 'id' }) as Observable<Transaction[]>;
    }

    /**
     * Get a single transaction by ID
     */
    async getByIdFirebase(id: string): Promise<Transaction | undefined> {
        const snapshot = await getDoc(doc(this.firestore, `transactions/${id}`));
        return snapshot.exists() ? ({ id: snapshot.id, ...snapshot.data() } as Transaction) : undefined;
    }

    /**
     * Update a transaction
     */
    updateFirebase(id: string, data: Partial<Transaction>) {
        const transactionDoc = doc(this.firestore, `transactions/${id}`);
        return updateDoc(transactionDoc, { ...data });
    }

    /**
     * Delete a transaction
     */
    deleteFirebase(id: string) {
        const transactionDoc = doc(this.firestore, `transactions/${id}`);
        return deleteDoc(transactionDoc);
    }

    /** Get income total from Firestore */
    getIncomeTotal(): Observable<number> {
        return this.getAllFirebase().pipe(
        map(transactions =>
            transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0)
        )
        );
    }

    /** Get expense total from Firestore */
    getExpenseTotal(): Observable<number> {
        return this.getAllFirebase().pipe(
        map(transactions =>
            transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0)
        )
        );
    }
}