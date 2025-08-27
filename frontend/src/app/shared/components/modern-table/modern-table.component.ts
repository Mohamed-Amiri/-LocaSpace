import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  type?: 'text' | 'number' | 'date' | 'badge' | 'actions';
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, row: any) => string;
}

export interface TableAction {
  label: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  action: (row: any) => void;
  visible?: (row: any) => boolean;
}

export interface TableConfig {
  selectable?: boolean;
  searchable?: boolean;
  paginated?: boolean;
  pageSize?: number;
  sortable?: boolean;
  actions?: TableAction[];
}

@Component({
  selector: 'app-modern-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modern-table-container">
      <!-- Table Header -->
      <div class="table-header" *ngIf="config.searchable || hasHeaderActions">
        <div class="search-section" *ngIf="config.searchable">
          <div class="search-input-wrapper">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Rechercher..."
              [(ngModel)]="searchTerm"
              (input)="onSearch()"
              class="search-input">
          </div>
        </div>
        
        <div class="header-actions" *ngIf="hasHeaderActions">
          <ng-content select="[slot=header-actions]"></ng-content>
        </div>
      </div>

      <!-- Bulk Actions -->
      <div class="bulk-actions" *ngIf="config.selectable && selectedRows.size > 0" [@fadeInUp]>
        <span class="selection-count">{{ selectedRows.size }} élément(s) sélectionné(s)</span>
        <div class="bulk-action-buttons">
          <ng-content select="[slot=bulk-actions]"></ng-content>
        </div>
      </div>

      <!-- Table -->
      <div class="table-wrapper">
        <table class="modern-table">
          <thead>
            <tr>
              <th *ngIf="config.selectable" class="select-column">
                <input
                  type="checkbox"
                  [checked]="allRowsSelected"
                  [indeterminate]="someRowsSelected"
                  (change)="toggleAllRows($event)"
                  class="table-checkbox">
              </th>
              <th
                *ngFor="let column of columns"
                [class.sortable]="column.sortable && config.sortable"
                [style.width]="column.width"
                [style.text-align]="column.align || 'left'"
                (click)="onSort(column)">
                <div class="column-header">
                  <span>{{ column.label }}</span>
                  <div class="sort-indicator" *ngIf="column.sortable && config.sortable">
                    <svg
                      *ngIf="sortColumn === column.key"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      [class.desc]="sortDirection === 'desc'">
                      <path d="M7 14l5-5 5 5"/>
                    </svg>
                  </div>
                </div>
              </th>
              <th *ngIf="config.actions && config.actions.length > 0" class="actions-column">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              *ngFor="let row of paginatedData; let i = index"
              [class.selected]="selectedRows.has(getRowId(row))"
              [class.hover]="true">
              <td *ngIf="config.selectable" class="select-column">
                <input
                  type="checkbox"
                  [checked]="selectedRows.has(getRowId(row))"
                  (change)="toggleRow(row, $event)"
                  class="table-checkbox">
              </td>
              <td
                *ngFor="let column of columns"
                [style.text-align]="column.align || 'left'"
                [class]="'column-' + column.type">
                <ng-container [ngSwitch]="column.type">
                  <!-- Badge type -->
                  <span
                    *ngSwitchCase="'badge'"
                    class="table-badge"
                    [class]="'badge-' + getBadgeClass(getValue(row, column.key))">
                    {{ column.render ? column.render(getValue(row, column.key), row) : getValue(row, column.key) }}
                  </span>
                  
                  <!-- Date type -->
                  <span *ngSwitchCase="'date'">
                    {{ getValue(row, column.key) | date:'short' }}
                  </span>
                  
                  <!-- Number type -->
                  <span *ngSwitchCase="'number'">
                    {{ getValue(row, column.key) | number }}
                  </span>
                  
                  <!-- Default text type -->
                  <span *ngSwitchDefault>
                    {{ column.render ? column.render(getValue(row, column.key), row) : getValue(row, column.key) }}
                  </span>
                </ng-container>
              </td>
              <td *ngIf="config.actions && config.actions.length > 0" class="actions-column">
                <div class="action-buttons">
                  <button
                    *ngFor="let action of config.actions"
                    [class]="'action-btn action-btn--' + (action.color || 'primary')"
                    [title]="action.label"
                    (click)="action.action(row)">
                    <span *ngIf="action.icon" [innerHTML]="action.icon"></span>
                    <span *ngIf="!action.icon">{{ action.label }}</span>
                  </button>
                </div>
              </td>
            </tr>
            
            <!-- Empty state -->
            <tr *ngIf="paginatedData.length === 0" class="empty-row">
              <td [attr.colspan]="getTotalColumns()">
                <div class="empty-state">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M16 16s-1.5-2-4-2-4 2-4 2"/>
                    <line x1="9" y1="9" x2="9.01" y2="9"/>
                    <line x1="15" y1="9" x2="15.01" y2="9"/>
                  </svg>
                  <p>Aucune donnée disponible</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="table-pagination" *ngIf="config.paginated && totalPages > 1">
        <div class="pagination-info">
          Affichage de {{ (currentPage - 1) * pageSize + 1 }} à {{ Math.min(currentPage * pageSize, filteredData.length) }} sur {{ filteredData.length }} résultats
        </div>
        <div class="pagination-controls">
          <button
            class="pagination-btn"
            [disabled]="currentPage === 1"
            (click)="changePage(currentPage - 1)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15,18 9,12 15,6"/>
            </svg>
            Précédent
          </button>
          
          <div class="page-numbers">
            <button
              *ngFor="let page of getVisiblePages()"
              class="page-btn"
              [class.active]="page === currentPage"
              (click)="changePage(page)">
              {{ page }}
            </button>
          </div>
          
          <button
            class="pagination-btn"
            [disabled]="currentPage === totalPages"
            (click)="changePage(currentPage + 1)">
            Suivant
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9,18 15,12 9,6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./modern-table.component.scss']
})
export class ModernTableComponent implements OnInit {
  Math = Math;
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() config: TableConfig = {};
  @Input() loading = false;
  @Input() idField = 'id';

  @Output() rowSelect = new EventEmitter<any[]>();
  @Output() sortChange = new EventEmitter<{column: string, direction: 'asc' | 'desc'}>();
  @Output() searchChange = new EventEmitter<string>();

  searchTerm = '';
  filteredData: any[] = [];
  paginatedData: any[] = [];
  selectedRows = new Set<any>();
  
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  currentPage = 1;
  pageSize = 10;
  
  hasHeaderActions = false;

  ngOnInit() {
    this.pageSize = this.config.pageSize || 10;
    this.filteredData = [...this.data];
    this.updatePagination();
    this.checkHeaderActions();
  }

  ngOnChanges() {
    this.filteredData = [...this.data];
    this.applyFilters();
    this.updatePagination();
  }

  private checkHeaderActions() {
    // This would be set by parent component if header actions are provided
    this.hasHeaderActions = false;
  }

  onSearch() {
    this.applyFilters();
    this.currentPage = 1;
    this.updatePagination();
    this.searchChange.emit(this.searchTerm);
  }

  private applyFilters() {
    this.filteredData = this.data.filter(row => {
      if (!this.searchTerm) return true;
      
      return this.columns.some(column => {
        const value = this.getValue(row, column.key);
        return value?.toString().toLowerCase().includes(this.searchTerm.toLowerCase());
      });
    });
  }

  onSort(column: TableColumn) {
    if (!column.sortable || !this.config.sortable) return;

    if (this.sortColumn === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column.key;
      this.sortDirection = 'asc';
    }

    this.filteredData.sort((a, b) => {
      const aVal = this.getValue(a, column.key);
      const bVal = this.getValue(b, column.key);
      const modifier = this.sortDirection === 'asc' ? 1 : -1;

      if (aVal < bVal) return -1 * modifier;
      if (aVal > bVal) return 1 * modifier;
      return 0;
    });

    this.updatePagination();
    this.sortChange.emit({ column: column.key, direction: this.sortDirection });
  }

  toggleAllRows(event: any) {
    const checked = event.target.checked;
    if (checked) {
      this.paginatedData.forEach(row => this.selectedRows.add(this.getRowId(row)));
    } else {
      this.paginatedData.forEach(row => this.selectedRows.delete(this.getRowId(row)));
    }
    this.emitSelection();
  }

  toggleRow(row: any, event: any) {
    const id = this.getRowId(row);
    if (event.target.checked) {
      this.selectedRows.add(id);
    } else {
      this.selectedRows.delete(id);
    }
    this.emitSelection();
  }

  private emitSelection() {
    const selectedData = this.data.filter(row => this.selectedRows.has(this.getRowId(row)));
    this.rowSelect.emit(selectedData);
  }

  changePage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  private updatePagination() {
    if (!this.config.paginated) {
      this.paginatedData = this.filteredData;
      return;
    }

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedData = this.filteredData.slice(start, end);
  }

  getVisiblePages(): number[] {
    const totalPages = this.totalPages;
    const current = this.currentPage;
    const delta = 2;
    
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(totalPages - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) {
      rangeWithDots.push(1, -1);
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (current + delta < totalPages - 1) {
      rangeWithDots.push(-1, totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots.filter((v, i, arr) => arr.indexOf(v) === i && v > 0);
  }

  getValue(row: any, key: string): any {
    return key.split('.').reduce((obj, k) => obj?.[k], row);
  }

  getRowId(row: any): any {
    return this.getValue(row, this.idField);
  }

  getBadgeClass(value: any): string {
    // Default badge classes based on common values
    const badgeMap: { [key: string]: string } = {
      'active': 'success',
      'inactive': 'secondary',
      'suspended': 'warning',
      'blocked': 'danger',
      'pending': 'warning',
      'approved': 'success',
      'rejected': 'danger',
      'admin': 'primary',
      'owner': 'secondary',
      'tenant': 'success'
    };
    
    return badgeMap[value?.toString().toLowerCase()] || 'secondary';
  }

  getTotalColumns(): number {
    let count = this.columns.length;
    if (this.config.selectable) count++;
    if (this.config.actions && this.config.actions.length > 0) count++;
    return count;
  }

  get allRowsSelected(): boolean {
    return this.paginatedData.length > 0 && 
           this.paginatedData.every(row => this.selectedRows.has(this.getRowId(row)));
  }

  get someRowsSelected(): boolean {
    return this.paginatedData.some(row => this.selectedRows.has(this.getRowId(row))) && 
           !this.allRowsSelected;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }
}