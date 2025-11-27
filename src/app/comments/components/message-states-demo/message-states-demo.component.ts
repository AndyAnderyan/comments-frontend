import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageStatesComponent, MessageStateData, MessageReadStatus } from '../message-states/message-states.component';

@Component({
  selector: 'app-message-states-demo',
  standalone: true,
  imports: [CommonModule, MessageStatesComponent],
  template: `
    <div class="demo-container">
      <h2>Message States Component Demo</h2>
      <p>Це демонстрація компонента станів повідомлень з дизайну Figma з різними комбінаціями isSelected та readStatus.</p>
      
      <div class="demo-controls">
        <div class="control-section">
          <h3>Глобальні налаштування:</h3>
          <label>
            <input type="checkbox" [checked]="showNotificationIcon()" (change)="toggleNotificationIcon()">
            Показувати іконку сповіщення
          </label>
        </div>
        
        <div class="control-section">
          <h3>Дії з повідомленнями:</h3>
          <button class="demo-button" (click)="toggleAllSelection()">
            {{ allSelected() ? 'Зняти вибір з усіх' : 'Вибрати всі' }}
          </button>
          <button class="demo-button secondary" (click)="markAllAsRead()">
            Позначити всі як прочитані
          </button>
          <button class="demo-button secondary" (click)="resetMessages()">
            Скинути стани
          </button>
        </div>
      </div>

      <div class="demo-states-grid">
        <h3>Матриця станів повідомлень:</h3>
        
        <!-- Headers -->
        <div class="states-grid">
          <div class="grid-header"></div>
          <div class="grid-header">isSelected = false</div>
          <div class="grid-header">isSelected = true</div>
          
          <!-- Default Row -->
          <div class="grid-label">Default</div>
          <div class="grid-cell">
            <app-message-states
              [message]="getMessageByState('default', false)"
              [showNotificationIcon]="showNotificationIcon()"
              (messageClick)="onMessageClick($event)"
              (toggleSelection)="onToggleSelection($event)">
            </app-message-states>
          </div>
          <div class="grid-cell">
            <app-message-states
              [message]="getMessageByState('default', true)"
              [showNotificationIcon]="showNotificationIcon()"
              (messageClick)="onMessageClick($event)"
              (toggleSelection)="onToggleSelection($event)">
            </app-message-states>
          </div>
          
          <!-- Unread Row -->
          <div class="grid-label">Непрочитане</div>
          <div class="grid-cell">
            <app-message-states
              [message]="getMessageByState('unread', false)"
              [showNotificationIcon]="showNotificationIcon()"
              (messageClick)="onMessageClick($event)"
              (toggleSelection)="onToggleSelection($event)">
            </app-message-states>
          </div>
          <div class="grid-cell">
            <app-message-states
              [message]="getMessageByState('unread', true)"
              [showNotificationIcon]="showNotificationIcon()"
              (messageClick)="onMessageClick($event)"
              (toggleSelection)="onToggleSelection($event)">
            </app-message-states>
          </div>
          
          <!-- Unread Notification Row -->
          <div class="grid-label">Непрочитане повідомлення із сповіщенням</div>
          <div class="grid-cell">
            <app-message-states
              [message]="getMessageByState('unread-notification', false)"
              [showNotificationIcon]="showNotificationIcon()"
              (messageClick)="onMessageClick($event)"
              (toggleSelection)="onToggleSelection($event)">
            </app-message-states>
          </div>
          <div class="grid-cell">
            <app-message-states
              [message]="getMessageByState('unread-notification', true)"
              [showNotificationIcon]="showNotificationIcon()"
              (messageClick)="onMessageClick($event)"
              (toggleSelection)="onToggleSelection($event)">
            </app-message-states>
          </div>
        </div>
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
      max-width: 1200px;
      margin: 0 auto;
      font-family: 'Daikon', sans-serif;
    }

    .demo-controls {
      margin: 20px 0;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .control-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .control-section h3 {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
      color: #17273f;
    }

    .control-section label {
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
      margin-right: 8px;
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

    .demo-states-grid {
      margin: 20px 0;
    }

    .demo-states-grid h3 {
      color: #17273f;
      margin: 0 0 16px 0;
      font-size: 16px;
    }

    .states-grid {
      display: grid;
      grid-template-columns: 200px 1fr 1fr;
      gap: 8px;
      border: 1px solid #e8e8e8;
      border-radius: 8px;
      overflow: hidden;
    }

    .grid-header {
      background: #f2f3f6;
      padding: 12px;
      font-weight: 700;
      font-size: 12px;
      color: #17273f;
      text-align: center;
      border-bottom: 1px solid #e8e8e8;
    }

    .grid-label {
      background: #f2f3f6;
      padding: 12px;
      font-weight: 700;
      font-size: 12px;
      color: #17273f;
      display: flex;
      align-items: center;
      border-right: 1px solid #e8e8e8;
      text-align: center;
    }

    .grid-cell {
      padding: 0;
      border-right: 1px solid #e8e8e8;
      border-bottom: 1px solid #e8e8e8;
    }

    .grid-cell:last-child {
      border-right: none;
    }

    .grid-cell app-message-states {
      display: block;
      width: 100%;
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

    /* Responsive Design */
    @media (max-width: 768px) {
      .states-grid {
        grid-template-columns: 1fr;
        gap: 4px;
      }
      
      .grid-header,
      .grid-label {
        text-align: left;
      }
      
      .grid-cell {
        border-right: none;
      }
    }
  `]
})
export class MessageStatesDemoComponent {
  showNotificationIcon = signal(true);
  lastAction = signal<any>(null);

  // Базові дані для повідомлень
  private baseMessages: Record<MessageReadStatus, MessageStateData> = {
    'default': {
      id: 'default',
      title: 'Ремонт сантехніки в спортзалі',
      content: 'В спортзалі протікає кран у роздягальні, що створює незручності для відвідувачів. Заявка на ремонт подана 05.11, статус — "в обробці". Необхідно терміново вжити заходів.',
      date: '10.11.2025',
      readStatus: 'default',
      isSelected: false
    },
    'unread': {
      id: 'unread',
      title: 'Ремонт сантехніки в спортзалі',
      content: 'В спортзалі протікає кран у роздягальні, що створює незручності для відвідувачів. Заявка на ремонт подана 05.11, статус — "в обробці". Необхідно терміново вжити заходів.',
      date: '10.11.2025',
      readStatus: 'unread',
      isSelected: false
    },
    'unread-notification': {
      id: 'unread-notification',
      title: 'Ремонт сантехніки в спортзалі',
      content: 'В спортзалі протікає кран у роздягальні, що створює незручності для відвідувачів. Заявка на ремонт подана 05.11, статус — "в обробці". Необхідно терміново вжити заходів.',
      date: '10.11.2025',
      readStatus: 'unread-notification',
      isSelected: false
    }
  };

  // Поточні стани повідомлень
  messages = signal<Record<string, MessageStateData>>({
    'default-false': { ...this.baseMessages.default, id: 'default-false' },
    'default-true': { ...this.baseMessages.default, id: 'default-true', isSelected: true },
    'unread-false': { ...this.baseMessages.unread, id: 'unread-false' },
    'unread-true': { ...this.baseMessages.unread, id: 'unread-true', isSelected: true },
    'unread-notification-false': { ...this.baseMessages['unread-notification'], id: 'unread-notification-false' },
    'unread-notification-true': { ...this.baseMessages['unread-notification'], id: 'unread-notification-true', isSelected: true }
  });

  toggleNotificationIcon() {
    this.showNotificationIcon.set(!this.showNotificationIcon());
  }

  getMessageByState(readStatus: MessageReadStatus, isSelected: boolean): MessageStateData {
    const key = `${readStatus}-${isSelected}`;
    return this.messages()[key];
  }

  allSelected(): boolean {
    return Object.values(this.messages()).every(msg => msg.isSelected);
  }

  toggleAllSelection() {
    const currentMessages = this.messages();
    const shouldSelectAll = !this.allSelected();
    
    const updatedMessages = Object.keys(currentMessages).reduce((acc, key) => {
      acc[key] = { ...currentMessages[key], isSelected: shouldSelectAll };
      return acc;
    }, {} as Record<string, MessageStateData>);
    
    this.messages.set(updatedMessages);
    
    this.lastAction.set({
      action: shouldSelectAll ? 'select_all' : 'deselect_all',
      timestamp: new Date().toISOString()
    });
  }

  markAllAsRead() {
    const currentMessages = this.messages();
    
    const updatedMessages = Object.keys(currentMessages).reduce((acc, key) => {
      acc[key] = { ...currentMessages[key], readStatus: 'default' as MessageReadStatus };
      return acc;
    }, {} as Record<string, MessageStateData>);
    
    this.messages.set(updatedMessages);
    
    this.lastAction.set({
      action: 'mark_all_read',
      timestamp: new Date().toISOString()
    });
  }

  resetMessages() {
    this.messages.set({
      'default-false': { ...this.baseMessages.default, id: 'default-false' },
      'default-true': { ...this.baseMessages.default, id: 'default-true', isSelected: true },
      'unread-false': { ...this.baseMessages.unread, id: 'unread-false' },
      'unread-true': { ...this.baseMessages.unread, id: 'unread-true', isSelected: true },
      'unread-notification-false': { ...this.baseMessages['unread-notification'], id: 'unread-notification-false' },
      'unread-notification-true': { ...this.baseMessages['unread-notification'], id: 'unread-notification-true', isSelected: true }
    });
    
    this.lastAction.set({
      action: 'reset',
      timestamp: new Date().toISOString()
    });
  }

  onMessageClick(message: MessageStateData) {
    this.lastAction.set({
      action: 'message_click',
      messageId: message.id,
      readStatus: message.readStatus,
      isSelected: message.isSelected,
      timestamp: new Date().toISOString()
    });
  }

  onToggleSelection(message: MessageStateData) {
    const currentMessages = this.messages();
    const updatedMessage = { ...message, isSelected: !message.isSelected };
    
    this.messages.set({
      ...currentMessages,
      [message.id]: updatedMessage
    });
    
    this.lastAction.set({
      action: 'toggle_selection',
      messageId: message.id,
      newSelectionState: updatedMessage.isSelected,
      timestamp: new Date().toISOString()
    });
  }
}
