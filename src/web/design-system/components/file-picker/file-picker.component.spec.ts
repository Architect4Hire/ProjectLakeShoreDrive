import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FilePickerComponent, FilePickerSelection } from './file-picker.component';

@Component({
  standalone: true,
  imports: [FilePickerComponent],
  template: `<lsd-file-picker id="evidence" label="Upload evidence" description="PDF files only"
    accept="application/pdf" [multiple]="true" [maxFiles]="2" [maxFileSizeBytes]="10"
    (filesSelected)="selection = $event">
    <span lsdFilePickerProgress>Uploading 50%</span><span lsdFilePickerError>Upload failed</span>
  </lsd-file-picker>`,
})
class FilePickerTestHostComponent { selection: FilePickerSelection | undefined; }

describe('FilePickerComponent', () => {
  let fixture: ComponentFixture<FilePickerTestHostComponent>;
  let host: FilePickerTestHostComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FilePickerTestHostComponent] }).compileComponents();
    fixture = TestBed.createComponent(FilePickerTestHostComponent); host = fixture.componentInstance; fixture.detectChanges();
  });
  it('provides a keyboard-focusable native browse action', () => {
    const input = fixture.debugElement.query(By.css('input[type="file"]')).nativeElement as HTMLInputElement;
    spyOn(input, 'click');
    const browse = fixture.debugElement.query(By.css('.lsd-file-picker__browse')).nativeElement as HTMLButtonElement;
    expect(browse.type).toBe('button'); browse.click(); expect(input.click).toHaveBeenCalled();
  });
  it('accepts valid files and announces type and size validation failures', () => {
    const input = fixture.debugElement.query(By.css('input[type="file"]')).nativeElement as HTMLInputElement;
    const valid = new File(['pdf'], 'valid.pdf', { type: 'application/pdf' });
    const wrongType = new File(['text'], 'notes.txt', { type: 'text/plain' });
    const tooLarge = new File(['01234567890'], 'large.pdf', { type: 'application/pdf' });
    Object.defineProperty(input, 'files', { configurable: true, value: [valid, wrongType, tooLarge] });
    input.dispatchEvent(new Event('change')); fixture.detectChanges();
    expect(host.selection?.accepted).toEqual([valid]); expect(host.selection?.rejected.length).toBe(2);
    const alert = fixture.debugElement.query(By.css('[role="alert"]')).nativeElement as HTMLElement;
    expect(alert.textContent).toContain('not an accepted file type');
    expect(alert.textContent).toContain('Only 2 files may be selected');
  });
  it('accepts dropped files as a pointer enhancement', () => {
    const file = new File(['pdf'], 'dropped.pdf', { type: 'application/pdf' });
    const drop = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(drop, 'dataTransfer', { value: { files: [file] } });
    fixture.debugElement.query(By.css('.lsd-file-picker__dropzone')).nativeElement.dispatchEvent(drop); fixture.detectChanges();
    expect(host.selection?.accepted).toEqual([file]);
  });
  it('reports file-size validation independently', () => {
    const input = fixture.debugElement.query(By.css('input[type="file"]')).nativeElement as HTMLInputElement;
    const tooLarge = new File(['01234567890'], 'large.pdf', { type: 'application/pdf' });
    Object.defineProperty(input, 'files', { configurable: true, value: [tooLarge] });
    input.dispatchEvent(new Event('change')); fixture.detectChanges();
    expect(host.selection?.accepted).toEqual([]);
    expect(host.selection?.rejected[0]?.reason).toContain('exceeds the maximum file size');
  });
  it('exposes polite progress and assertive transport-error hooks', () => {
    expect(fixture.debugElement.query(By.css('.lsd-file-picker__progress')).attributes['aria-live']).toBe('polite');
    expect(fixture.debugElement.query(By.css('.lsd-file-picker__error')).attributes['aria-live']).toBe('assertive');
  });
});
