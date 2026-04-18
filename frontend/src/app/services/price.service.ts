import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

export interface BitcoinPrice {
  price: number;
  market_cap: number;
  volume_24h: number;
  change_24h: number;
  timestamp: string;
}

export interface PriceSnapshot {
  id: number;
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
  recordedAt: string;
}

export interface AlertRequest {
  email: string;
  targetPrice: number;
  direction: 'ABOVE' | 'BELOW';
}

@Injectable({ providedIn: 'root' })
export class PriceService implements OnDestroy {

  private readonly API_URL  = 'https://wib-price-service.onrender.com/api/price';
  private readonly WS_URL   = 'wss://wib-notification-service.onrender.com/ws/price';

  private ws!: WebSocket;
  private priceSubject = new BehaviorSubject<BitcoinPrice | null>(null);
  price$ = this.priceSubject.asObservable();

  constructor(private http: HttpClient) {}

  connectWebSocket(): void {
    this.ws = new WebSocket(this.WS_URL);

    this.ws.onopen = () => console.log('[WS] Connected to price stream');

    this.ws.onmessage = (event) => {
      try {
        const data: BitcoinPrice = JSON.parse(event.data);
        this.priceSubject.next(data);
      } catch (e) {
        console.error('[WS] Failed to parse message', e);
      }
    };

    this.ws.onerror = (e) => console.error('[WS] Error', e);

    this.ws.onclose = () => {
      console.warn('[WS] Disconnected — reconnecting in 5s...');
      setTimeout(() => this.connectWebSocket(), 5000);
    };
  }

  disconnectWebSocket(): void {
    if (this.ws) {
      this.ws.onclose = null; // prevent reconnect loop
      this.ws.close();
    }
  }

  getCurrentPrice(): Observable<BitcoinPrice> {
    return this.http.get<BitcoinPrice>(`${this.API_URL}/current`);
  }

  getHistory(minutes: number = 1440): Observable<PriceSnapshot[]> {
    return this.http.get<PriceSnapshot[]>(`${this.API_URL}/history?minutes=${minutes}`);
  }

  registerAlert(request: AlertRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/alerts`, request);
  }

  ngOnDestroy(): void {
    this.disconnectWebSocket();
  }
}
