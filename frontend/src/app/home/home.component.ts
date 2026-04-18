import {
  Component, OnInit, OnDestroy, AfterViewInit,
  ElementRef, ViewChild, HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslationService, Lang } from '../services/translation.service';
import { TranslatePipe } from '../pipes/translate.pipe';

interface Particle {
  x: number; y: number; radius: number; angle: number;
  speed: number; orbitRadius: number; opacity: number;
  size: number; color: string;
}

interface TimelineEvent {
  year: string; title: string; description: string; highlight?: boolean;
}

interface Pillar {
  icon: string; title: string; description: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('particleCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private animationId!: number;
  private particles: Particle[] = [];
  private glowIntensity = 0;
  private glowDir = 1;
  private langSub!: Subscription;

  activeSection = 'hero';
  menuOpen = false;
  currentYear = new Date().getFullYear();

  navLinks: { label: string; anchor: string }[] = [];
  stats: { value: string; label: string }[] = [];
  timeline: TimelineEvent[] = [];
  pillars: Pillar[] = [];

  constructor(public ts: TranslationService) {}

  ngOnInit(): void {
    this.loadContent();
    this.langSub = this.ts.lang$.subscribe(() => this.loadContent());
  }

  ngAfterViewInit(): void {
    this.initCanvas();
    this.createParticles();
    this.animate();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
    this.langSub?.unsubscribe();
  }

  private loadContent(): void {
    this.navLinks = [
      { label: this.ts.t('nav.origin'),     anchor: 'origin' },
      { label: this.ts.t('nav.timeline'),   anchor: 'timeline' },
      { label: this.ts.t('nav.technology'), anchor: 'technology' },
      { label: this.ts.t('nav.impact'),     anchor: 'impact' },
    ];

    this.stats = [
      { value: '21M',      label: this.ts.t('stats.supply') },
      { value: '2009',     label: this.ts.t('stats.genesis') },
      { value: '$0→$70K+', label: this.ts.t('stats.price') },
      { value: '1B+',      label: this.ts.t('stats.wallets') },
    ];

    this.timeline = [
      { year: '2008', title: this.ts.t('tl.2008.title'), description: this.ts.t('tl.2008.desc'), highlight: true },
      { year: '2009', title: this.ts.t('tl.2009.title'), description: this.ts.t('tl.2009.desc') },
      { year: '2010', title: this.ts.t('tl.2010.title'), description: this.ts.t('tl.2010.desc'), highlight: true },
      { year: '2011', title: this.ts.t('tl.2011.title'), description: this.ts.t('tl.2011.desc') },
      { year: '2013', title: this.ts.t('tl.2013.title'), description: this.ts.t('tl.2013.desc') },
      { year: '2017', title: this.ts.t('tl.2017.title'), description: this.ts.t('tl.2017.desc'), highlight: true },
      { year: '2021', title: this.ts.t('tl.2021.title'), description: this.ts.t('tl.2021.desc') },
      { year: '2024', title: this.ts.t('tl.2024.title'), description: this.ts.t('tl.2024.desc'), highlight: true },
    ];

    this.pillars = [
      { icon: '🔒', title: this.ts.t('pillar.decentralization.title'), description: this.ts.t('pillar.decentralization.desc') },
      { icon: '⛓️', title: this.ts.t('pillar.blockchain.title'),       description: this.ts.t('pillar.blockchain.desc') },
      { icon: '⛏️', title: this.ts.t('pillar.pow.title'),              description: this.ts.t('pillar.pow.desc') },
      { icon: '✂️', title: this.ts.t('pillar.halving.title'),          description: this.ts.t('pillar.halving.desc') },
    ];
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
