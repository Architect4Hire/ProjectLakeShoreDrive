import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { elevationTokens } from '../../tokens/elevation';
import { globalLayers } from '../../tokens/layers';
import { panelSizes } from '../../tokens/sizing';
import {
  DesignSystemNotification,
  NotificationAnnouncement,
  NotificationService,
  NotificationSeverity,
} from './notification.service';

@Component({
  selector: 'lsd-notification-viewport',
  standalone: true,
  templateUrl: './notification-viewport.component.html',
  styleUrl: './notification-viewport.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationViewportComponent {
  protected readonly notificationService = inject(NotificationService);
  protected readonly notificationLayer = globalLayers.notification;
  protected readonly notificationWidth = panelSizes['drawer-compact'];
  protected readonly notificationShadow = elevationTokens.popover;

  protected dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }

  protected invokeAction(notification: DesignSystemNotification): void {
    notification.action?.invoke();
    if (notification.action?.dismissOnInvoke !== false) {
      this.dismiss(notification.id);
    }
  }

  protected role(announcement: NotificationAnnouncement): 'alert' | 'status' | 'group' {
    return announcement === 'assertive' ? 'alert' : announcement === 'polite' ? 'status' : 'group';
  }

  protected classes(severity: NotificationSeverity): string {
    return ['lsd-notification border', this.severityClasses[severity]].join(' ');
  }

  protected symbol(severity: NotificationSeverity): string {
    return this.symbols[severity];
  }

  private readonly severityClasses: Record<NotificationSeverity, string> = {
    neutral: 'border-border-default bg-surface-raised text-text-primary',
    info: 'border-status-info bg-surface-raised text-text-primary',
    success: 'border-status-success bg-surface-raised text-text-primary',
    warning: 'border-status-warning bg-surface-raised text-text-primary',
    danger: 'border-status-danger bg-surface-raised text-text-primary',
  };

  private readonly symbols: Record<NotificationSeverity, string> = {
    neutral: '•', info: 'i', success: '✓', warning: '!', danger: '!',
  };
}
