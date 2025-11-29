import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopicFormComponent } from '../topic-form/topic-form.component';

@Component({
  selector: 'app-topic-form-demo',
  standalone: true,
  imports: [CommonModule, TopicFormComponent],
  template: `
    <div class="demo-container">
      <h2>Topic Form Component Demo</h2>
      <p>This demonstrates the Figma design implementation for the topic creation form.</p>
      
      <div class="demo-controls">
        <label>
          <input type="checkbox" [checked]="isDisabled()" (change)="toggleDisabled()">
          Disable form
        </label>
      </div>

      <div class="demo-form-wrapper">
        <app-topic-form
          [placeholder]="'Напишіть тему обговорення'"
          [disabled]="isDisabled()"
          (back)="onBack()"
          (create)="onTopicCreated($event)">
        </app-topic-form>
      </div>

      <div class="demo-log" *ngIf="lastAction()">
        <h3>Last Action:</h3>
        <pre>{{ lastAction() | json }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
      font-family: 'Daikon', sans-serif;
    }

    .demo-controls {
      margin: 20px 0;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .demo-controls label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      cursor: pointer;
    }

    .demo-form-wrapper {
      display: flex;
      justify-content: center;
      margin: 20px 0;
      padding: 20px;
      background: #f9f9f9;
      border-radius: 8px;
      border: 2px dashed #e0e0e0;
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
export class TopicFormDemoComponent {
  isDisabled = signal(false);
  lastAction = signal<any>(null);

  toggleDisabled() {
    this.isDisabled.set(!this.isDisabled());
  }

  onBack() {
    this.lastAction.set({ 
      action: 'back', 
      timestamp: new Date().toISOString() 
    });
  }

  onTopicCreated(event: { topic: string }) {
    this.lastAction.set({ 
      action: 'create', 
      topic: event.topic, 
      timestamp: new Date().toISOString() 
    });
  }
}
