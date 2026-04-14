import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ElementRef, ViewChild, HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Particle {
  x: number; y: number; radius: number; angle: number;
  speed: number; orbitRadius: number; opacity: number;
  size: number; color: string;
}

interface TimelineEvent {
  year: string; title: string; description: string; highlight?: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('particleCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private animationId!: number;
  private particles: Particle[] = [];
  private pulseAngle = 0;
  private glowIntensity = 0;
  private glowDir = 1;

  activeSection: string = 'hero';
  menuOpen = false;
  currentYear = new Date().getFullYear();

  navLinks = [
    { label: 'Origin', anchor: 'origin' },
    { label: 'Timeline', anchor: 'timeline' },
    { label: 'Technology', anchor: 'technology' },
    { label: 'Impact', anchor: 'impact' },
  ];

  stats = [
    { value: '21M', label: 'Total Supply Cap' },
    { value: '2009', label: 'Year of Genesis' },
    { value: '$0→$70K+', label: 'Price Journey' },
    { value: '1B+', label: 'Wallets Created' },
  ];

  timeline: TimelineEvent[] = [
    { year: '2008', title: 'The Whitepaper', description: 'On October 31st, an entity known as Satoshi Nakamoto published "Bitcoin: A Peer-to-Peer Electronic Cash System." Nine pages that would change finance forever. The world was in the midst of a banking crisis — the timing was not a coincidence.', highlight: true },
    { year: '2009', title: 'Genesis Block', description: 'On January 3rd, the first Bitcoin block was mined. Embedded in it: a headline from The Times — "Chancellor on brink of second bailout for banks." A declaration of intent, carved into the blockchain for eternity.' },
    { year: '2010', title: 'First Real Transaction', description: 'Programmer Laszlo Hanyecz paid 10,000 BTC for two pizzas — the first known commercial transaction. Those coins would later be worth over $700 million. Every May 22nd is now celebrated as Bitcoin Pizza Day.', highlight: true },
    { year: '2011', title: 'Parity with the Dollar', description: 'Bitcoin reached $1 USD for the first time, achieving parity with the world\'s reserve currency. Silk Road launched, exposing Bitcoin to controversy. Mt. Gox becomes the dominant exchange.' },
    { year: '2013', title: 'First Bubble', description: 'Bitcoin surged past $1,000 for the first time, capturing mainstream headlines. The Cyprus banking crisis drove demand as citizens sought alternatives to a collapsing financial system.' },
    { year: '2017', title: 'The Great Bull Run', description: 'Bitcoin reached nearly $20,000, igniting a global frenzy. ICOs flooded the market. Futures trading launched on the CME. Institutional eyes turned toward crypto for the first time.', highlight: true },
    { year: '2021', title: 'Institutional Adoption', description: 'MicroStrategy, Tesla, and Square added Bitcoin to their balance sheets. El Salvador made it legal tender — the first nation to do so. Bitcoin peaked above $68,000. A new era had begun.' },
    { year: '2024', title: 'The ETF Era', description: 'The SEC approved Bitcoin spot ETFs in January, opening the floodgates for retail and institutional capital. BlackRock, Fidelity and other giants entered the arena. Bitcoin broke all-time highs once again.', highlight: true },
  ];

  pillars = [
    { icon: '🔒', title: 'Decentralization', description: 'No central authority controls Bitcoin. It runs on thousands of nodes distributed worldwide — censorship-resistant by design.' },
    { icon: '⛓️', title: 'Blockchain', description: 'Every transaction is recorded on an immutable public ledger. Transparent, permanent, and verifiable by anyone on Earth.' },
    { icon: '⛏️', title: 'Proof of Work', description: 'Miners compete to solve cryptographic puzzles, securing the network and earning newly minted Bitcoin as a reward.' },
    { icon: '✂️', title: 'The Halving', description: 'Every ~4 years, the mining reward is cut in half. This controlled scarcity mimics gold — and drives Bitcoin\'s long-term price cycles.' },
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initCanvas();
    this.createParticles();
    this.animate();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
  }

  @HostListener('window:resize')
  onResize(): void { this.initCanvas(); }

  private initCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    this.ctx = canvas.getContext('2d')!;
  }

  private createParticles(): void {
    const canvas = this.canvasRef.nativeElement;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    this.particles = [];
    for (let i = 0; i < 120; i++) {
      const orbitRadius = 100 + Math.random() * 250;
      this.particles.push({
        x: cx, y: cy, radius: orbitRadius,
        angle: Math.random() * Math.PI * 2,
        speed: (0.0003 + Math.random() * 0.0008) * (Math.random() > 0.5 ? 1 : -1),
        orbitRadius, opacity: 0.2 + Math.random() * 0.8,
        size: 0.5 + Math.random() * 2.5,
        color: Math.random() > 0.6
          ? `rgba(247,147,26,${0.4 + Math.random() * 0.6})`
          : `rgba(255,200,100,${0.2 + Math.random() * 0.4})`
      });
    }
  }

  private animate(): void {
    const canvas = this.canvasRef.nativeElement;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.glowIntensity += 0.008 * this.glowDir;
    if (this.glowIntensity >= 1 || this.glowIntensity <= 0) this.glowDir *= -1;
    this.pulseAngle += 0.01;

    for (let ring = 1; ring <= 3; ring++) {
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, ring * 110, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(247,147,26,${0.04 + this.glowIntensity * 0.03})`;
      this.ctx.lineWidth = 0.5;
      this.ctx.stroke();
    }

    const grad = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, 130);
    grad.addColorStop(0, `rgba(247,147,26,${0.15 + this.glowIntensity * 0.12})`);
    grad.addColorStop(0.5, `rgba(247,147,26,${0.05 + this.glowIntensity * 0.04})`);
    grad.addColorStop(1, 'rgba(247,147,26,0)');
    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, 130, 0, Math.PI * 2);
    this.ctx.fill();

    for (const p of this.particles) {
      p.angle += p.speed;
      p.x = cx + Math.cos(p.angle) * p.orbitRadius;
      p.y = cy + Math.sin(p.angle) * p.orbitRadius * 0.38;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.fill();
      if (p.size > 1.8) {
        const g = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 4);
        g.addColorStop(0, 'rgba(247,147,26,0.25)');
        g.addColorStop(1, 'rgba(247,147,26,0)');
        this.ctx.fillStyle = g;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  scrollTo(anchor: string): void {
    document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
    this.menuOpen = false;
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const sections = ['hero', 'origin', 'timeline', 'technology', 'impact'];
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120 && rect.bottom >= 120) {
          this.activeSection = id;
          break;
        }
      }
    }
  }
}
