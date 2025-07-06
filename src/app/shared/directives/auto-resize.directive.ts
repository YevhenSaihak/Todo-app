import { AfterViewInit, Directive, ElementRef, HostListener, inject } from '@angular/core';

@Directive({
  selector: 'textarea[appAutoResize]',
  standalone: true,
})
export class AutoResizeDirective implements AfterViewInit {
  private el = inject(ElementRef<HTMLTextAreaElement>);

  ngAfterViewInit(): void {
    this.adjust();
  }

  @HostListener('input')
  onInput(): void {
    this.adjust();
  }

  private adjust(): void {
    const textarea = this.el.nativeElement as HTMLTextAreaElement;
    textarea.style.overflow = 'hidden';
    textarea.style.height = '48px';
    textarea.style.minHeight = '48px';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
}
