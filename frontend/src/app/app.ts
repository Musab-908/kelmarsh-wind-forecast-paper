import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FEATURES, Feature } from './feature-schema';
import { PredictionResponse, PredictionService } from './prediction.service';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  readonly fields = FEATURES;
  readonly deployedStatic = !['localhost', '127.0.0.1'].includes(window.location.hostname);
  values: Record<string, string | number | null> = {};
  loading = false;
  error = '';
  result: PredictionResponse | null = null;
  private readonly api = inject(PredictionService);

  constructor() {
    for (const field of this.fields) this.values[field.name] = null;
  }

  trackField(_index: number, field: Feature): string {
    return field.name;
  }

  submit(): void {
    this.error = '';
    this.result = null;
    if (this.deployedStatic) {
      this.error = 'Static GitHub Pages demo: start Angular + Flask locally for predictions.';
      return;
    }
    const payload: Record<string, string | number> = {};
    for (const field of this.fields) {
      const value = this.values[field.name];
      if (value === null || value === '') {
        this.error = `Enter a value for ${field.label}`;
        return;
      }
      const numeric = Number(value);
      if (!Number.isFinite(numeric) ||
          (field.min !== undefined && numeric < field.min) ||
          (field.max !== undefined && numeric > field.max)) {
        this.error = `Invalid or out-of-range value for ${field.label}`;
        return;
      }
      payload[field.name] = numeric;
    }
    this.loading = true;
    this.api.predict(payload).subscribe({
      next: result => { this.result = result; this.loading = false; },
      error: err => {
        this.error = `API error ${err.status || ''}: ` +
          (err.error?.error || err.message || 'Check Flask terminal');
        this.loading = false;
      },
    });
  }
}
