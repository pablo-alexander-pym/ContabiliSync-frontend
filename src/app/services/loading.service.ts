import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoadingState } from '../models';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<LoadingState>({
    isLoading: false
  });

  public loading$ = this.loadingSubject.asObservable();

  private requestCount = 0;

  /**
   * Mostrar loading
   */
  show(message?: string): void {
    this.requestCount++;
    this.loadingSubject.next({
      isLoading: true,
      message
    });
  }

  /**
   * Ocultar loading
   */
  hide(): void {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.loadingSubject.next({
        isLoading: false
      });
    }
  }

  /**
   * Forzar ocultar loading
   */
  forceHide(): void {
    this.requestCount = 0;
    this.loadingSubject.next({
      isLoading: false
    });
  }

  /**
   * Obtener estado actual
   */
  isLoading(): boolean {
    return this.loadingSubject.value.isLoading;
  }

  /**
   * Obtener estado observable
   */
  getLoadingState(): Observable<LoadingState> {
    return this.loading$;
  }
}
