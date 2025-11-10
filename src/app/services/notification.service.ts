import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  private idCounter = 0;

  /**
   * Mostrar notificación de éxito
   */
  success(title: string, message: string, duration: number = 5000): void {
    this.addNotification({
      id: this.generateId(),
      type: 'success',
      title,
      message,
      duration,
      autoClose: true
    });
  }

  /**
   * Mostrar notificación de error
   */
  error(title: string, message: string, duration: number = 7000): void {
    this.addNotification({
      id: this.generateId(),
      type: 'error',
      title,
      message,
      duration,
      autoClose: true
    });
  }

  /**
   * Mostrar notificación de advertencia
   */
  warning(title: string, message: string, duration: number = 6000): void {
    this.addNotification({
      id: this.generateId(),
      type: 'warning',
      title,
      message,
      duration,
      autoClose: true
    });
  }

  /**
   * Mostrar notificación de información
   */
  info(title: string, message: string, duration: number = 5000): void {
    this.addNotification({
      id: this.generateId(),
      type: 'info',
      title,
      message,
      duration,
      autoClose: true
    });
  }

  /**
   * Agregar notificación personalizada
   */
  addNotification(notification: Notification): void {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);

    // Auto-cerrar si está configurado
    if (notification.autoClose && notification.duration) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, notification.duration);
    }
  }

  /**
   * Remover notificación por ID
   */
  removeNotification(id: string): void {
    const currentNotifications = this.notificationsSubject.value;
    const filteredNotifications = currentNotifications.filter(n => n.id !== id);
    this.notificationsSubject.next(filteredNotifications);
  }

  /**
   * Limpiar todas las notificaciones
   */
  clearAll(): void {
    this.notificationsSubject.next([]);
  }

  /**
   * Obtener notificaciones actuales
   */
  getNotifications(): Notification[] {
    return this.notificationsSubject.value;
  }

  /**
   * Generar ID único
   */
  private generateId(): string {
    return `notification-${++this.idCounter}-${Date.now()}`;
  }
}
