import { TestBed } from '@angular/core/testing';

import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
    service.clear();
  });

  it('queues typed notifications with accessible defaults', () => {
    const id = service.notify({ title: 'Saved', message: 'Changes were saved.', severity: 'success' });
    expect(service.notifications()).toEqual([
      jasmine.objectContaining({ id, severity: 'success', announcement: 'polite', dismissible: true }),
    ]);
  });

  it('dismisses one notification without disturbing the remaining queue', () => {
    const first = service.notify({ title: 'First', message: 'First message.' });
    const second = service.notify({ title: 'Second', message: 'Second message.' });
    service.dismiss(first);
    expect(service.notifications().map((item) => item.id)).toEqual([second]);
  });
});
