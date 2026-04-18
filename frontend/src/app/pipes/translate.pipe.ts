import { Pipe, PipeTransform, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { TranslationService } from '../services/translation.service';
import { Subscription } from 'rxjs';

@Pipe({ name: 'translate', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform, OnDestroy {
  private sub: Subscription;

  constructor(
    private ts: TranslationService,
    private cd: ChangeDetectorRef
  ) {
    this.sub = this.ts.lang$.subscribe(() => this.cd.markForCheck());
  }

  transform(key: string): string {
    return this.ts.t(key);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
