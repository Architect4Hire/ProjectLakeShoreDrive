import { Injectable, signal } from '@angular/core';

export type NotificationAnnouncement = 'polite' | 'assertive' | 'off';
export type NotificationSeverity = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface NotificationAction {
  readonly label: string;
  readonly invoke: () => void;
  readonly dismissOnInvoke?: boolean;
}

export interface NotificationRequest {
  readonly title: string;
  readonly message: string;
  readonly severity?: NotificationSeverity;
  readonly announcement?: NotificationAnnouncement;
  readonly dismissible?: boolean;
  readonly action?: NotificationAction;
}

export interface DesignSystemNotification extends NotificationRequest {
  readonly id: string;
  readonly severity: NotificationSeverity;
  readonly announcement: NotificationAnnouncement;
  readonly dismissible: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly queue = signal<readonly DesignSystemNotification[]>([]);
  private nextId = 0;

  readonly notifications = this.queue.asReadonly();

  notify(request: NotificationRequest): string {
    const id = `lsd-notification-${++this.nextId}`;
    this.queue.update((current) => [
      ...current,
      {
        ...request,
        id,
        severity: request.severity ?? 'neutral',
        announcement: request.announcement ?? 'polite',
        dismissible: request.dismissible ?? true,
      },
    ]);
    return id;
  }

  dismiss(id: string): void {
    this.queue.update((current) => current.filter((notification) => notification.id !== id));
  }

  clear(): void {
    this.queue.set([]);
  }
}
