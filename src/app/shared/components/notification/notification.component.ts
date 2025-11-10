import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../services/notification.service';
import { Observable } from 'rxjs';
import { Notification } from '../../../models';

@Component({
  selector: 'app-notification',
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  private notificationService = inject(NotificationService);

  notifications$: Observable<Notification[]> = this.notificationService.notifications$;

  closeNotification(id: string): void {
    this.notificationService.removeNotification(id);
  }

  trackByFn(index: number, notification: Notification): string {
    return notification.id;
  }

  getIconClass(type: string): string {
    const icons: Record<string, string> = {
      'success': 'fas fa-check-circle',
      'error': 'fas fa-exclamation-circle',
      'warning': 'fas fa-exclamation-triangle',
      'info': 'fas fa-info-circle'
    };
    return icons[type] || 'fas fa-info-circle';
  }

  getAlertClass(type: string): string {
    const classes: Record<string, string> = {
      'success': 'alert-success',
      'error': 'alert-danger',
      'warning': 'alert-warning',
      'info': 'alert-info'
    };
    return classes[type] || 'alert-info';
  }
}
