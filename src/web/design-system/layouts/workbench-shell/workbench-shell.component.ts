import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lsd-workbench-shell',
  templateUrl: './workbench-shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkbenchShellComponent {
  readonly navigationLabel = input('Primary navigation');
}
