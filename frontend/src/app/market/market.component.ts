import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ViewChild, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { PriceService, BitcoinPrice, PriceSnapshot } from '../services/price.service';

Chart.register(...registerables);

@Component({
  selector: 'app-market',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('priceChart') chartRef!: ElementRef<HTMLCanvasElement>;

  private chart!: Chart;
  private priceSub!: Subscription;

  // ── Live data ────────────────────────────────────
  currentPrice: BitcoinPrice = {
    price: 0,
    market_cap: 0,
    volume_24h: 0,
    change_24h: 0,
    timestamp: new Date().toISOString()
  };
  loading = true;
  wsConnected = false;
  lastUpdated: Date | null = null;
  priceDirection: 'up' | 'down' | null = null;
  private previousPrice: number | null = null;

  // ── History ──────────────────────────────────────
  selectedPeriod: number = 7;
  periods = [
    { label: '7D', days: 7 },
    { label: '30D', days: 30 },
    { label: '1Y', days: 365 },
  ];

  // ── Alert form ───────────────────────────────────
  alertEmail = '';
  alertPrice: number | null = null;
  alertDirection: 'ABOVE' | 'BELOW' = 'ABOVE';
  alertSubmitting = false;
  alertSuccess = false;
  alertError = '';
  currentYear = new Date().getFullYear();

  constructor(private priceService: PriceService) {}

  ngOnInit(): void {
    // Load initial price via HTTP
    this.priceService.getCurrentPrice().subscribe({
      next: (p) => {
        if (p) {
          this.currentPrice = p;
          this.previousPrice = p.price;
          this.loading = false;
        }
      },
      error: () => {
        console.warn('No cached price yet — waiting for WebSocket');
      }
    });

    // Connect WebSocket
    this.priceService.connectWebSocket();
    this.wsConnected = true;

    this.priceSub = this.priceService.price$.subscribe(price => {
      if (!price) return;
      if (this.previousPrice !== null) {
        this.priceDirection = price.price > this.previousPrice ? 'up' : 'down';
        setTimeout(() => this.priceDirection = null, 1500);
      }
      this.previousPrice = price.price;
      this.currentPrice = price;
      this.lastUpdated = new Date();
      this.loading = false;
    });
  }

  ngAfterViewInit(): void {
    this.loadHistory(this.selectedPeriod);
  }

  ngOnDestroy(): void {
    this.priceSub?.unsubscribe();
    this.priceService.disconnectWebSocket();
    this.chart?.destroy();
  }

  loadHistory(days: number): void {
    this.selectedPeriod = days;
    this.priceService.getHistory(days).subscribe({
      next: (snapshots) => this.renderChart(snapshots),
      error: () => console.warn('Could not fetch history')
    });
  }

  private renderChart(snapshots: PriceSnapshot[]): void {
    const labels = snapshots.map(s =>
      new Date(s.recordedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );
    const prices = snapshots.map(s => s.price);

    if (this.chart) this.chart.destroy();

    const ctx = this.chartRef.nativeElement.getContext('2d')!;

    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(247,147,26,0.3)');
    gradient.addColorStop(1, 'rgba(247,147,26,0)');

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Bitcoin Price (USD)',
          data: prices,
          borderColor: '#f7931a',
          borderWidth: 2,
          backgroundColor: gradient,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: '#f7931a',
          tension: 0.4,
          fill: true,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a1a1a',
            borderColor: 'rgba(247,147,26,0.3)',
            borderWidth: 1,
            titleColor: '#f7931a',
            bodyColor: '#f0ece3',
            callbacks: {
              label: (ctx) => ` $${Number(ctx.raw).toLocaleString()}`
            }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: { color: '#4a4540', maxTicksLimit: 8 }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)' },
            ticks: {
              color: '#4a4540',
              callback: (v) => `$${Number(v).toLocaleString()}`
            }
          }
        }
      }
    });
  }

  submitAlert(): void {
    if (!this.alertEmail || !this.alertPrice) return;
    this.alertSubmitting = true;
    this.alertError = '';
    this.currentYear = new Date().getFullYear();
    this.alertSuccess = false;

    this.priceService.registerAlert({
      email: this.alertEmail,
      targetPrice: this.alertPrice,
      direction: this.alertDirection
    }).subscribe({
      next: () => {
        this.alertSuccess = true;
        this.alertSubmitting = false;
        this.alertEmail = '';
        this.alertPrice = null;
      },
      error: () => {
        this.alertError = 'Failed to register alert. Please try again.';
        this.alertSubmitting = false;
      }
    });
  }

  formatPrice(value: number | null | undefined): string {
    if (value == null) return '—';
    return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatLarge(value: number | null | undefined): string {
    if (value == null) return '—';
    if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
    return `$${value.toLocaleString()}`;
  }
}
