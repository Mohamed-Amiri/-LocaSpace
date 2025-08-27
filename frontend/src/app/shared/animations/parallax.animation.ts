import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[parallax]',
  standalone: true
})
export class ParallaxDirective {
  @Input() parallaxRatio = 0.5;
  @Input() parallaxAxis: 'X' | 'Y' = 'Y';
  @Input() parallaxReverse = false;

  private initialOffset = 0;

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    // Store the initial position
    this.initialOffset = this.elementRef.nativeElement.getBoundingClientRect().top;
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    const windowScrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    const elementRect = this.elementRef.nativeElement.getBoundingClientRect();
    const elementVisible = this.isElementVisible(elementRect);

    if (elementVisible) {
      const offset = windowScrollTop * this.parallaxRatio;
      const transform = this.parallaxAxis === 'X' 
        ? `translateX(${this.parallaxReverse ? -offset : offset}px)`
        : `translateY(${this.parallaxReverse ? -offset : offset}px)`;

      this.elementRef.nativeElement.style.transform = transform;
    }
  }

  private isElementVisible(rect: DOMRect): boolean {
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    return rect.top <= windowHeight && rect.bottom >= 0;
  }
}

@Directive({
  selector: '[parallaxGroup]',
  standalone: true
})
export class ParallaxGroupDirective {
  @Input() parallaxDepth = 0;
  @Input() parallaxPerspective = 1000; // pixels

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.elementRef.nativeElement.style.transformStyle = 'preserve-3d';
    this.elementRef.nativeElement.style.perspective = `${this.parallaxPerspective}px`;
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    const scrolled = window.pageYOffset || document.documentElement.scrollTop;
    const transform = `translateZ(${scrolled * this.parallaxDepth}px)`;
    this.elementRef.nativeElement.style.transform = transform;
  }
}