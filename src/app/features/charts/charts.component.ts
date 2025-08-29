import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, ChartOptions, ChartData } from 'chart.js';
import { TransactionService } from '../../core/services/transaction.service-local';

Chart.register(...registerables);

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <section *ngIf="isBrowser" class="grid">
      <div class="card chart-container">
        <h3>Expenses by Category</h3>
        <canvas baseChart
                [data]="pieData"
                [type]="'pie'"
                [options]="pieOptions">
        </canvas>
      </div>

      <div class="card chart-container">
        <h3>Monthly Income vs Expenses</h3>
        <canvas baseChart
                [data]="barData"
                [type]="'bar'"
                [options]="barOptions">
        </canvas>
      </div>

      <div class="card wide chart-container">
        <h3>Cumulative Balance Over Time</h3>
        <canvas baseChart
                [data]="lineData"
                [type]="'line'"
                [options]="lineOptions">
        </canvas>
      </div>
    </section>
  `,
  styles: [`
    .grid { display: grid; gap: 16px; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
    .card { padding: 12px; background: #fff; border-radius: 12px; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
    .wide { grid-column: 1 / -1; }
    h3 { margin: 4px 0 12px; }
  `]
})
export class ChartsComponent {
  isBrowser = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private ts: TransactionService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.generateCharts();
    }
  }

  // Chart data
  pieData!: ChartData<'pie'>;
  barData!: ChartData<'bar'>;
  lineData!: ChartData<'line'>;

  // Chart options
  pieOptions: ChartOptions<'pie'> = { responsive: true, maintainAspectRatio: false };
  barOptions: ChartOptions<'bar'> = { responsive: true, maintainAspectRatio: false };
  lineOptions: ChartOptions<'line'> = { responsive: true, maintainAspectRatio: false };

  private generateCharts() {
    const txs = [...this.ts.transactions()].sort((a,b) => a.date < b.date ? -1 : 1);

    // PIE: Expenses by category
    const catMap = new Map<string, number>();
    txs.filter(t => t.type === 'expense').forEach(t => {
      catMap.set(t.category, (catMap.get(t.category) ?? 0) + t.amount);
    });
    this.pieData = {
      labels: Array.from(catMap.keys()),
      datasets: [{ data: Array.from(catMap.values()) }]
    };

    // BAR: Monthly income vs expense
    const months = Array.from(new Set(txs.map(t => t.date.slice(0,7)))).sort();
    const incomeSeries = months.map(m =>
      txs.filter(t => t.date.startsWith(m) && t.type === 'income').reduce((s,t) => s + t.amount, 0)
    );
    const expenseSeries = months.map(m =>
      txs.filter(t => t.date.startsWith(m) && t.type === 'expense').reduce((s,t) => s + t.amount, 0)
    );
    this.barData = {
      labels: months,
      datasets: [
        { label: 'Income', data: incomeSeries },
        { label: 'Expenses', data: expenseSeries }
      ]
    };

    // LINE: Cumulative balance over time
    let running = 0;
    const labels: string[] = [];
    const points: number[] = [];
    txs.forEach(t => {
      running += t.type === 'income' ? t.amount : -t.amount;
      labels.push(t.date);
      points.push(running);
    });
    this.lineData = {
      labels,
      datasets: [{ label: 'Balance', data: points, fill: false }]
    };
  }
}
