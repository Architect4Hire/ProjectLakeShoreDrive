import { booleanAttribute, ChangeDetectionStrategy, Component, ElementRef, input, output, signal, viewChild } from '@angular/core';

export interface FileRejection {
  readonly file: File;
  readonly reason: string;
}

export interface FilePickerSelection {
  readonly accepted: readonly File[];
  readonly rejected: readonly FileRejection[];
}

export type FileValidator = (file: File) => string | undefined;

@Component({
  selector: 'lsd-file-picker',
  standalone: true,
  templateUrl: './file-picker.component.html',
  styleUrl: './file-picker.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilePickerComponent {
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly description = input<string | undefined>(undefined);
  readonly browseLabel = input('Browse files');
  readonly dropLabel = input('or drag and drop');
  readonly accept = input<string | undefined>(undefined);
  readonly multiple = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly maxFiles = input<number | undefined>(undefined);
  readonly maxFileSizeBytes = input<number | undefined>(undefined);
  readonly validateFile = input<FileValidator>(() => undefined);

  readonly filesSelected = output<FilePickerSelection>();

  protected readonly dragging = signal(false);
  protected readonly rejections = signal<readonly FileRejection[]>([]);
  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');
  private dragDepth = 0;

  protected browse(): void {
    if (!this.disabled()) this.fileInput().nativeElement.click();
  }

  protected choose(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.process(Array.from(inputElement.files ?? []));
    inputElement.value = '';
  }

  protected dragEnter(event: DragEvent): void {
    event.preventDefault();
    if (this.disabled()) return;
    this.dragDepth += 1;
    this.dragging.set(true);
  }

  protected dragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = this.disabled() ? 'none' : 'copy';
  }

  protected dragLeave(event: DragEvent): void {
    event.preventDefault();
    if (this.disabled()) return;
    this.dragDepth = Math.max(0, this.dragDepth - 1);
    if (this.dragDepth === 0) this.dragging.set(false);
  }

  protected drop(event: DragEvent): void {
    event.preventDefault();
    this.dragDepth = 0;
    this.dragging.set(false);
    if (!this.disabled()) this.process(Array.from(event.dataTransfer?.files ?? []));
  }

  private process(files: readonly File[]): void {
    const accepted: File[] = [];
    const rejected: FileRejection[] = [];
    const limit = this.multiple() ? this.maxFiles() : 1;

    files.forEach((file, index) => {
      const reason = limit !== undefined && index >= limit
        ? `Only ${limit} file${limit === 1 ? '' : 's'} may be selected.`
        : this.validationReason(file);
      if (reason) rejected.push({ file, reason });
      else accepted.push(file);
    });

    this.rejections.set(rejected);
    this.filesSelected.emit({ accepted, rejected });
  }

  private validationReason(file: File): string | undefined {
    if (this.maxFileSizeBytes() !== undefined && file.size > this.maxFileSizeBytes()!) {
      return `${file.name} exceeds the maximum file size.`;
    }
    if (this.accept() && !this.matchesAccept(file, this.accept()!)) {
      return `${file.name} is not an accepted file type.`;
    }
    return this.validateFile()(file);
  }

  private matchesAccept(file: File, accept: string): boolean {
    return accept.split(',').map((value) => value.trim().toLocaleLowerCase()).filter(Boolean).some((rule) => {
      if (rule.startsWith('.')) return file.name.toLocaleLowerCase().endsWith(rule);
      if (rule.endsWith('/*')) return file.type.toLocaleLowerCase().startsWith(rule.slice(0, -1));
      return file.type.toLocaleLowerCase() === rule;
    });
  }
}
