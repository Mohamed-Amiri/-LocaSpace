import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="pagination" role="navigation" aria-label="pagination">
      <button
        class="pagination-button"
        [class.disabled]="currentPage === 1"
        (click)="onPageChange(currentPage - 1)"
        [attr.aria-label]="'Page précédente'"
        [disabled]="currentPage === 1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <div class="pagination-pages">
        <button
          *ngIf="showFirstPage"
          class="pagination-page"
          [class.active]="currentPage === 1"
          (click)="onPageChange(1)"
        >1</button>

        <span *ngIf="showLeftDots" class="pagination-dots">...</span>

        <button
          *ngFor="let page of visiblePages"
          class="pagination-page"
          [class.active]="currentPage === page"
          (click)="onPageChange(page)"
        >{{ page }}</button>

        <span *ngIf="showRightDots" class="pagination-dots">...</span>

        <button
          *ngIf="showLastPage"
          class="pagination-page"
          [class.active]="currentPage === totalPages"
          (click)="onPageChange(totalPages)"
        >{{ totalPages }}</button>
      </div>

      <button
        class="pagination-button"
        [class.disabled]="currentPage === totalPages"
        (click)="onPageChange(currentPage + 1)"
        [attr.aria-label]="'Page suivante'"
        [disabled]="currentPage === totalPages"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </nav>
  `,
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() siblingCount = 1;
  @Output() pageChange = new EventEmitter<number>();

  get visiblePages(): number[] {
    const pages: number[] = [];
    const totalNumbers = this.siblingCount * 2 + 3; // siblings + current + first + last
    const totalBlocks = totalNumbers + 2; // total numbers + 2 dots

    if (this.totalPages <= totalBlocks) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    const leftSiblingIndex = Math.max(this.currentPage - this.siblingCount, 1);
    const rightSiblingIndex = Math.min(
      this.currentPage + this.siblingCount,
      this.totalPages
    );

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      pages.push(i);
    }

    return pages;
  }

  get showLeftDots(): boolean {
    return this.visiblePages[0] > 2;
  }

  get showRightDots(): boolean {
    return this.visiblePages[this.visiblePages.length - 1] < this.totalPages - 1;
  }

  get showFirstPage(): boolean {
    return this.visiblePages[0] > 1;
  }

  get showLastPage(): boolean {
    return this.visiblePages[this.visiblePages.length - 1] < this.totalPages;
  }

  onPageChange(page: number): void {
    if (
      page === this.currentPage ||
      page < 1 ||
      page > this.totalPages
    ) {
      return;
    }

    this.pageChange.emit(page);
  }
}