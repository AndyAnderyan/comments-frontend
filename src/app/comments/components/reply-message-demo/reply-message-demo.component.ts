import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReplyMessageComponent, ReplyMessageData } from '../reply-message/reply-message.component';

@Component({
  selector: 'app-reply-message-demo',
  standalone: true,
  imports: [CommonModule, ReplyMessageComponent],
  template: `
    <div class="demo-container">
      <h2>Reply Message Component Demo</h2>
      <p>Це демонстрація компонента повідомлення з відповіддю з дизайну Figma.</p>
      
      <div class="demo-controls">
        <label>
          <input type="checkbox" [checked]="showActions()" (change)="toggleActions()">
          Показати дії (Відповісти, Більше)
        </label>
        <label>
          <input type="checkbox" [checked]="showReply()" (change)="toggleReply()">
          Показати цитовану відповідь
        </label>
        <div class="control-group">
          <label for="replyLength">Максимальна довжина цитати:</label>
          <input 
            id="replyLength"
            type="number" 
            [value]="maxReplyLength()" 
            (input)="updateReplyLength($event)"
            min="20"
            max="500"
            step="10"
          >
        </div>
      </div>

      <div class="demo-messages">
        <h3>Повідомлення з відповіддю:</h3>
        <app-reply-message
          [message]="messageWithReply()"
          [showActions]="showActions()"
          [maxReplyLength]="maxReplyLength()"
          (reply)="onReply($event)"
          (more)="onMore($event)"
          (replyClick)="onReplyClick($event)">
        </app-reply-message>

        <h3>Звичайне повідомлення:</h3>
        <app-reply-message
          [message]="simpleMessage"
          [showActions]="showActions()"
          [maxReplyLength]="maxReplyLength()"
          (reply)="onReply($event)"
          (more)="onMore($event)"
          (replyClick)="onReplyClick($event)">
        </app-reply-message>

        <h3>Повідомлення з довгою цитатою:</h3>
        <app-reply-message
          [message]="longReplyMessage"
          [showActions]="showActions()"
          [maxReplyLength]="maxReplyLength()"
          (reply)="onReply($event)"
          (more)="onMore($event)"
          (replyClick)="onReplyClick($event)">
        </app-reply-message>
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
      max-width: 800px;
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
      gap: 12px;
    }

    .demo-controls label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      cursor: pointer;
    }

    .control-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .control-group label {
      cursor: default;
      font-weight: 600;
    }

    .control-group input[type="number"] {
      padding: 4px 8px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      width: 100px;
    }

    .demo-messages {
      margin: 20px 0;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .demo-messages h3 {
      color: #17273f;
      margin: 0 0 8px 0;
      font-size: 14px;
    }

    .demo-messages app-reply-message {
      max-width: 500px;
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
export class ReplyMessageDemoComponent {
  showActions = signal(true);
  showReply = signal(true);
  maxReplyLength = signal(100);
  lastAction = signal<any>(null);

  // Базове повідомлення з відповіддю
  private baseMessageWithReply: ReplyMessageData = {
    id: '1',
    author: 'Владислав Вікторович Ткачук',
    content: 'Система опалення в бібліотеці не працює: температура в приміщенні нижча за норму. Заявка на ремонт подана 01.11, статус — "в обробці". Потрібно терміново вирішити.',
    time: '14:10',
    replyTo: {
      id: '2',
      author: 'Романенко Роман Романович',
      content: 'Система опалення в бібліотеці не працює: температура в приміщенні нижча за норму. Заявка на ремонт подана 01.11, статус — "в обробці". Потрібно терміново вирішити.'
    }
  };

  // Звичайне повідомлення без відповіді
  simpleMessage: ReplyMessageData = {
    id: '3',
    author: 'Марія Петрівна Коваленко',
    content: 'Дякую за швидке вирішення проблеми з опаленням. Тепер у бібліотеці комфортна температура.',
    time: '15:30'
  };

  // Повідомлення з довгою цитатою
  longReplyMessage: ReplyMessageData = {
    id: '4',
    author: 'Олександр Сергійович Мельник',
    content: 'Повністю погоджуюся з попереднім коментарем. Додатково хочу зазначити, що потрібно провести профілактичне обслуговування всієї системи опалення.',
    time: '16:45',
    replyTo: {
      id: '5',
      author: 'Анна Володимирівна Шевченко',
      content: 'Система опалення в бібліотеці дійсно потребує уваги. За останній місяць було декілька випадків, коли температура опускалася нижче комфортного рівня. Це створює незручності для відвідувачів та може вплинути на збереження книжкового фонду. Рекомендую не тільки усунути поточну проблему, але й провести комплексну діагностику всієї системи опалення, щоб запобігти подібним ситуаціям у майбутньому.'
    }
  };

  messageWithReply = signal<ReplyMessageData>(this.baseMessageWithReply);

  toggleActions() {
    this.showActions.set(!this.showActions());
  }

  toggleReply() {
    const current = this.messageWithReply();
    if (this.showReply()) {
      // Приховати відповідь
      this.messageWithReply.set({
        ...current,
        replyTo: undefined
      });
      this.showReply.set(false);
    } else {
      // Показати відповідь
      this.messageWithReply.set(this.baseMessageWithReply);
      this.showReply.set(true);
    }
  }

  updateReplyLength(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value, 10);
    if (!isNaN(value) && value >= 20 && value <= 500) {
      this.maxReplyLength.set(value);
    }
  }

  onReply(message: ReplyMessageData) {
    this.lastAction.set({
      action: 'reply',
      messageId: message.id,
      author: message.author,
      timestamp: new Date().toISOString()
    });
  }

  onMore(message: ReplyMessageData) {
    this.lastAction.set({
      action: 'more',
      messageId: message.id,
      author: message.author,
      timestamp: new Date().toISOString()
    });
  }

  onReplyClick(replyId: string) {
    this.lastAction.set({
      action: 'reply_click',
      replyId: replyId,
      timestamp: new Date().toISOString()
    });
  }
}
