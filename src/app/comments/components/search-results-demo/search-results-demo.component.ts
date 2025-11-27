import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultsComponent, SearchResult } from '../search-results/search-results.component';

@Component({
  selector: 'app-search-results-demo',
  standalone: true,
  imports: [CommonModule, SearchResultsComponent],
  template: `
    <div class="demo-container">
      <h2>Search Results Component Demo</h2>
      <p>Це демонстрація компонента результатів пошуку з дизайну Figma.</p>
      
      <div class="demo-controls">
        <label>
          <input type="checkbox" [checked]="isLoading()" (change)="toggleLoading()">
          Показати стан завантаження
        </label>
        <button class="demo-button" (click)="addMockResults()">
          Додати тестові результати
        </button>
        <button class="demo-button secondary" (click)="clearResults()">
          Очистити результати
        </button>
      </div>

      <div class="demo-search-wrapper">
        <app-search-results
          [results]="searchResults()"
          [isLoading]="isLoading()"
          [placeholder]="'Пошук по темах та повідомленнях...'"
          (search)="onSearch($event)"
          (resultSelect)="onResultSelect($event)"
          (clearSearch)="onClearSearch()">
        </app-search-results>
      </div>

      <div class="demo-log" *ngIf="lastAction()">
        <h3>Остання дія:</h3>
        <pre>{{ lastAction() | json }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 20px;
      max-width: 1000px;
      margin: 0 auto;
      font-family: 'Daikon', sans-serif;
    }

    .demo-controls {
      margin: 20px 0;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .demo-controls label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      cursor: pointer;
    }

    .demo-button {
      background: #008cff;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .demo-button:hover {
      background: #0068ff;
    }

    .demo-button.secondary {
      background: #737c89;
    }

    .demo-button.secondary:hover {
      background: #505050;
    }

    .demo-search-wrapper {
      display: flex;
      justify-content: center;
      margin: 20px 0;
      padding: 20px;
      background: #f9f9f9;
      border-radius: 8px;
      border: 2px dashed #e0e0e0;
      height: 500px;
    }

    .demo-search-wrapper app-search-results {
      width: 304px;
      height: 100%;
      border: 1px solid #e8e8e8;
      border-radius: 8px;
      overflow: hidden;
    }

    .demo-log {
      margin-top: 20px;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
      border-left: 4px solid #008cff;
    }

    .demo-log h3 {
      margin: 0 0 8px 0;
      color: #17273f;
      font-size: 14px;
      font-weight: 700;
    }

    .demo-log pre {
      margin: 0;
      font-size: 12px;
      color: #737c89;
      white-space: pre-wrap;
    }

    h2 {
      color: #17273f;
      margin-bottom: 8px;
    }

    p {
      color: #737c89;
      margin-bottom: 20px;
    }
  `]
})
export class SearchResultsDemoComponent {
  searchResults = signal<SearchResult[]>([]);
  isLoading = signal(false);
  lastAction = signal<any>(null);

  private mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'Ремонт сантехніки в спортзалі',
      content: 'В спортзалі протікає кран у роздягальні, що створює незручності для відвідувачів. Заявка на ремонт подана 05.11, статус — "в обробці". Необхідно терміново вжити заходів.',
      date: '10.11.2025',
      type: 'topic'
    },
    {
      id: '2',
      title: 'Проблема з опаленням',
      content: 'У кімнаті 205 не працює опалення. Температура в приміщенні критично низька.',
      date: '09.11.2025',
      type: 'topic'
    },
    {
      id: '3',
      title: 'Ремонт завершено',
      content: 'Ремонт сантехніки в спортзалі успішно завершено. Всі системи працюють в штатному режимі.',
      date: '12.11.2025',
      type: 'message'
    },
    {
      id: '4',
      title: 'Додаткові матеріали',
      content: 'Для ремонту опалення потрібні додаткові матеріали. Список додається до заявки.',
      date: '11.11.2025',
      type: 'message'
    },
    {
      id: '5',
      title: 'Планове обслуговування',
      content: 'Заплановано планове обслуговування всіх систем ремонту та технічного забезпечення.',
      date: '08.11.2025',
      type: 'message'
    }
  ];

  toggleLoading() {
    this.isLoading.set(!this.isLoading());
  }

  addMockResults() {
    this.searchResults.set([...this.mockResults]);
    this.lastAction.set({ 
      action: 'add_results', 
      count: this.mockResults.length,
      timestamp: new Date().toISOString() 
    });
  }

  clearResults() {
    this.searchResults.set([]);
    this.lastAction.set({ 
      action: 'clear_results', 
      timestamp: new Date().toISOString() 
    });
  }

  onSearch(query: string) {
    this.lastAction.set({ 
      action: 'search', 
      query: query,
      timestamp: new Date().toISOString() 
    });

    // Симуляція пошуку
    if (query.trim()) {
      const filtered = this.mockResults.filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.content.toLowerCase().includes(query.toLowerCase())
      );
      this.searchResults.set(filtered);
    } else {
      this.searchResults.set([]);
    }
  }

  onResultSelect(result: SearchResult) {
    this.lastAction.set({ 
      action: 'select_result', 
      result: result,
      timestamp: new Date().toISOString() 
    });
  }

  onClearSearch() {
    this.searchResults.set([]);
    this.lastAction.set({ 
      action: 'clear_search', 
      timestamp: new Date().toISOString() 
    });
  }
}
