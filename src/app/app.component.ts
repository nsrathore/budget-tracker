import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary">
      <span class="app-title">Budget Tracker</span>
      <span class="spacer"></span>
      <a mat-button routerLink="">Dashboard</a>
      <a mat-button routerLink="transactions">Transactions</a>
      <a mat-button routerLink="charts">Charts</a>
    </mat-toolbar>

    <main class="container">
      <router-outlet />
    </main>
  `,
  styles: [`
    .app-title { font-weight: 600; }
    .spacer { flex: 1 1 auto; }
    .container { padding: 16px; max-width: 1000px; margin: 0 auto; }
  `]
})
export class AppComponent {}