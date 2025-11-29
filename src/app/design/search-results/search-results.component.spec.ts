import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { SearchResultsComponent, SearchResult } from './search-results.component';

describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;

  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'Ремонт сантехніки в спортзалі',
      content: 'В спортзалі протікає кран у роздягальні, що створює незручності для відвідувачів.',
      date: '10.11.2025',
      type: 'topic'
    },
    {
      id: '2',
      title: 'Повідомлення про ремонт',
      content: 'Заявка на ремонт подана 05.11, статус — "в обробці".',
      date: '11.11.2025',
      type: 'message'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultsComponent, ReactiveFormsModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize search form', () => {
    expect(component.searchQuery?.value).toBe('');
  });

  it('should filter results by type', () => {
    component.results = mockResults;
    component.ngOnChanges();
    
    expect(component.filteredTopics().length).toBe(1);
    expect(component.filteredMessages().length).toBe(1);
  });

  it('should emit search event on input change', (done) => {
    component.search.subscribe((query: string) => {
      expect(query).toBe('test');
      done();
    });

    component.searchForm.patchValue({ searchQuery: 'test' });
  });

  it('should emit clear search event', () => {
    spyOn(component.clearSearch, 'emit');
    component.onClearSearch();
    expect(component.clearSearch.emit).toHaveBeenCalled();
    expect(component.searchQuery?.value).toBe('');
  });

  it('should emit result select event', () => {
    spyOn(component.resultSelect, 'emit');
    const result = mockResults[0];
    component.onResultClick(result);
    expect(component.resultSelect.emit).toHaveBeenCalledWith(result);
  });

  it('should detect if has search query', () => {
    expect(component.hasSearchQuery).toBe(false);
    component.searchForm.patchValue({ searchQuery: 'test' });
    expect(component.hasSearchQuery).toBe(true);
  });

  it('should detect if has results', () => {
    expect(component.hasResults).toBe(false);
    component.results = mockResults;
    expect(component.hasResults).toBe(true);
  });

  it('should detect if has topics', () => {
    component.results = mockResults;
    component.ngOnChanges();
    expect(component.hasTopics).toBe(true);
  });

  it('should detect if has messages', () => {
    component.results = mockResults;
    component.ngOnChanges();
    expect(component.hasMessages).toBe(true);
  });
});
