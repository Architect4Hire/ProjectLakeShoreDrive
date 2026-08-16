import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CitationChipComponent } from '../../components';
import { SourcePreviewComponent } from '../../patterns';
import { SourceCitationsComponent, type SourceCitationItem } from './source-citations.component';

@Component({ standalone: true, imports: [SourceCitationsComponent], template: `
  <lsd-source-citations id="answer-sources" [citations]="citations" [selectedSourceId]="selected"
    [previewOpen]="open" (selectionRequested)="requested = $event.sourceId"
    (previewRetryRequested)="retried = $event.sourceId">
    <p lsdSourceCitationPassage>Selected evidence passage</p>
    <p lsdSourceCitationContext>Surrounding source context</p>
  </lsd-source-citations>` })
class HostComponent {
  citations: readonly SourceCitationItem[] = [
    { sourceId: 'SRC-101', sourceTitle: 'Architecture brief', sourceSection: 'Availability', artifactType: 'Document', version: '3' },
    { sourceId: 'SRC-202', sourceTitle: 'Discovery notes', sourceSection: 'Operations' },
  ];
  selected = 'SRC-101'; open = false; requested?: string; retried?: string;
}

describe('SourceCitationsComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent); fixture.detectChanges();
  });

  it('renders stable citation chips sharing the preview relationship', () => {
    const chips = fixture.debugElement.queryAll(By.directive(CitationChipComponent));
    expect(chips.length).toBe(2);
    expect(chips.map(x => x.componentInstance.previewId())).toEqual(['answer-sources-preview', 'answer-sources-preview']);
    expect(fixture.nativeElement.textContent).toContain('2 sources');
  });

  it('emits the selected typed citation without mutating caller state', () => {
    const second = fixture.debugElement.queryAll(By.css('lsd-citation-chip button'))[1].nativeElement as HTMLButtonElement;
    second.click(); fixture.detectChanges();
    expect(fixture.componentInstance.requested).toBe('SRC-202');
    expect(fixture.componentInstance.selected).toBe('SRC-101');
  });

  it('resolves selected metadata and projected passage/context into the preview', () => {
    const preview = fixture.debugElement.query(By.directive(SourcePreviewComponent));
    expect(preview.componentInstance.source().sourceId).toBe('SRC-101');
    expect(preview.nativeElement.textContent).toContain('Architecture brief');
    expect(preview.nativeElement.textContent).toContain('Selected evidence passage');
    expect(preview.nativeElement.textContent).toContain('Surrounding source context');
  });

  it('marks only the selected chip expanded when preview state is open', () => {
    fixture.componentInstance.open = true;
    const chips = fixture.debugElement.queryAll(By.directive(CitationChipComponent));
    fixture.detectChanges();
    expect(chips[0].componentInstance.previewOpen()).toBeTrue();
    expect(chips[1].componentInstance.previewOpen()).toBeFalse();
  });

  it('forwards retry intent only for a source in the caller-provided collection', () => {
    fixture.debugElement.query(By.directive(SourcePreviewComponent)).componentInstance.retryRequested.emit(fixture.componentInstance.citations[0]);
    expect(fixture.componentInstance.retried).toBe('SRC-101');
  });
});
