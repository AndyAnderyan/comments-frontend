import { Component, EventEmitter, Input, Output, inject, OnInit, OnChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'topic' | 'message';
}

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit, OnChanges {
  @Input() results: SearchResult[] = [];
  @Input() isLoading: boolean = false;
  @Input() placeholder: string = 'Пошук...';

  @Output() search = new EventEmitter<string>();
  @Output() resultSelect = new EventEmitter<SearchResult>();
  @Output() clearSearch = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  searchForm!: FormGroup;
  
  filteredTopics = signal<SearchResult[]>([]);
  filteredMessages = signal<SearchResult[]>([]);

  ngOnInit() {
    this.searchForm = this.fb.group({
      searchQuery: ['']
    });

    // Підписуємося на зміни в полі пошуку з debounce
    this.searchForm.get('searchQuery')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(query => {
        this.onSearchChange(query);
      });

    // Ініціалізуємо результати
    this.updateFilteredResults();
  }

  ngOnChanges() {
    this.updateFilteredResults();
  }

  private updateFilteredResults() {
    const topics = this.results.filter(result => result.type === 'topic');
    const messages = this.results.filter(result => result.type === 'message');
    
    this.filteredTopics.set(topics);
    this.filteredMessages.set(messages);
  }

  onSearchChange(query: string) {
    this.search.emit(query.trim());
  }

  onClearSearch() {
    this.searchForm.patchValue({ searchQuery: '' });
    this.clearSearch.emit();
  }

  onResultClick(result: SearchResult) {
    this.resultSelect.emit(result);
  }

  get searchQuery() {
    return this.searchForm.get('searchQuery');
  }

  get hasSearchQuery(): boolean {
    return !!this.searchQuery?.value?.trim();
  }

  get hasResults(): boolean {
    return this.results.length > 0;
  }

  get hasTopics(): boolean {
    return this.filteredTopics().length > 0;
  }

  get hasMessages(): boolean {
    return this.filteredMessages().length > 0;
  }
}
