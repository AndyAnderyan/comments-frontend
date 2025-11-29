import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultsDemoComponent } from './search-results-demo.component';

describe('SearchResultsDemoComponent', () => {
  let component: SearchResultsDemoComponent;
  let fixture: ComponentFixture<SearchResultsDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchResultsDemoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchResultsDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle loading state', () => {
    expect(component.isLoading()).toBe(false);
    component.toggleLoading();
    expect(component.isLoading()).toBe(true);
  });

  it('should add mock results', () => {
    component.addMockResults();
    expect(component.searchResults().length).toBeGreaterThan(0);
    expect(component.lastAction()?.action).toBe('add_results');
  });

  it('should clear results', () => {
    component.addMockResults();
    component.clearResults();
    expect(component.searchResults().length).toBe(0);
    expect(component.lastAction()?.action).toBe('clear_results');
  });

  it('should handle search', () => {
    component.onSearch('ремонт');
    expect(component.lastAction()?.action).toBe('search');
    expect(component.lastAction()?.query).toBe('ремонт');
  });

  it('should handle result selection', () => {
    const mockResult = {
      id: '1',
      title: 'Test',
      content: 'Test content',
      date: '10.11.2025',
      type: 'topic' as const
    };
    
    component.onResultSelect(mockResult);
    expect(component.lastAction()?.action).toBe('select_result');
    expect(component.lastAction()?.result).toEqual(mockResult);
  });

  it('should handle clear search', () => {
    component.onClearSearch();
    expect(component.searchResults().length).toBe(0);
    expect(component.lastAction()?.action).toBe('clear_search');
  });
});
