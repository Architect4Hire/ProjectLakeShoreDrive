import { ChangeDetectionStrategy, Component, computed, HostListener, input, model, output, signal } from '@angular/core';

import { DialogComponent, DialogInitialFocusDirective } from '../../primitives';

export interface CommandPaletteCommand<T> {
  readonly id: string;
  readonly identity: T;
  readonly label: string;
  readonly description?: string;
  readonly keywords?: readonly string[];
  readonly shortcut?: string;
  readonly disabled?: boolean;
}

export interface CommandPaletteGroup<T> {
  readonly id: string;
  readonly label: string;
  readonly commands: readonly CommandPaletteCommand<T>[];
}

export interface CommandPaletteShortcut {
  readonly key: string;
  readonly modifier: 'primary' | 'control' | 'meta';
}

const defaultShortcut: CommandPaletteShortcut = { key: 'k', modifier: 'primary' };

@Component({
  selector: 'lsd-command-palette',
  standalone: true,
  imports: [DialogComponent, DialogInitialFocusDirective],
  templateUrl: './command-palette.component.html',
  styleUrl: './command-palette.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandPaletteComponent<T = string> {
  readonly id = input.required<string>();
  readonly title = input('Command palette');
  readonly searchLabel = input('Search commands');
  readonly placeholder = input('Type a command');
  readonly groups = input.required<readonly CommandPaletteGroup<T>[]>();
  readonly shortcut = input<CommandPaletteShortcut>(defaultShortcut);
  readonly shortcutEnabled = input(true);
  readonly open = model(false);
  readonly query = model('');

  readonly commandSelected = output<T>();

  protected readonly activeIndex = signal(0);
  protected readonly filteredGroups = computed(() => {
    const query = this.query().trim().toLocaleLowerCase();
    if (!query) return this.groups();
    return this.groups()
      .map((group) => ({
        ...group,
        commands: group.commands.filter((command) =>
          [command.label, command.description ?? '', ...(command.keywords ?? [])]
            .join(' ')
            .toLocaleLowerCase()
            .includes(query),
        ),
      }))
      .filter((group) => group.commands.length > 0);
  });
  protected readonly enabledCommands = computed(() =>
    this.filteredGroups().flatMap((group) => group.commands).filter((command) => !command.disabled),
  );
  protected readonly activeCommand = computed(() => {
    const commands = this.enabledCommands();
    return commands.length ? commands[Math.min(this.activeIndex(), commands.length - 1)] : undefined;
  });
  protected readonly activeDescendant = computed(() => {
    const command = this.activeCommand();
    return command ? this.commandId(command) : null;
  });

  @HostListener('document:keydown', ['$event'])
  protected handleGlobalShortcut(event: KeyboardEvent): void {
    if (!this.shortcutEnabled() || event.repeat || !this.matchesShortcut(event)) return;
    event.preventDefault();
    this.activeIndex.set(0);
    this.open.set(!this.open());
  }

  protected updateQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.activeIndex.set(0);
  }

  protected handleSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') this.moveActive(1, event);
    else if (event.key === 'ArrowUp') this.moveActive(-1, event);
    else if (event.key === 'Home') this.moveToBoundary(0, event);
    else if (event.key === 'End') this.moveToBoundary(this.enabledCommands().length - 1, event);
    else if (event.key === 'Enter' && this.activeCommand()) {
      event.preventDefault();
      this.select(this.activeCommand()!);
    }
  }

  protected select(command: CommandPaletteCommand<T>): void {
    if (command.disabled) return;
    this.commandSelected.emit(command.identity);
    this.close();
  }

  protected close(): void {
    this.open.set(false);
    this.query.set('');
    this.activeIndex.set(0);
  }

  protected commandId(command: CommandPaletteCommand<T>): string { return `${this.id()}-command-${command.id}`; }
  protected groupId(group: CommandPaletteGroup<T>): string { return `${this.id()}-group-${group.id}`; }
  protected isActive(command: CommandPaletteCommand<T>): boolean { return this.activeCommand()?.id === command.id; }

  private moveActive(delta: 1 | -1, event: KeyboardEvent): void {
    const count = this.enabledCommands().length;
    if (!count) return;
    event.preventDefault();
    this.activeIndex.update((index) => (index + delta + count) % count);
  }

  private moveToBoundary(index: number, event: KeyboardEvent): void {
    if (index < 0) return;
    event.preventDefault();
    this.activeIndex.set(index);
  }

  private matchesShortcut(event: KeyboardEvent): boolean {
    const shortcut = this.shortcut();
    const modifierMatches = shortcut.modifier === 'control'
      ? event.ctrlKey
      : shortcut.modifier === 'meta'
        ? event.metaKey
        : event.ctrlKey || event.metaKey;
    return modifierMatches && event.key.toLocaleLowerCase() === shortcut.key.toLocaleLowerCase();
  }
}
