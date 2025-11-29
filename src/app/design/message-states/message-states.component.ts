import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type MessageReadStatus = 'default' | 'unread' | 'unread-notification';

export interface MessageStateData {
  id: string;
  title: string;
  content: string;
  date: string;
  readStatus: MessageReadStatus;
  isSelected: boolean;
}

@Component({
  selector: 'app-message-states',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message-states.component.html',
  styleUrls: ['./message-states.component.css']
})
export class MessageStatesComponent {
  @Input() message!: MessageStateData;
  @Input() showNotificationIcon: boolean = true;

  @Output() messageClick = new EventEmitter<MessageStateData>();
  @Output() toggleSelection = new EventEmitter<MessageStateData>();

  onClick() {
    this.messageClick.emit(this.message);
  }

  onToggleSelection(event: Event) {
    event.stopPropagation();
    this.toggleSelection.emit(this.message);
  }

  get messageClasses(): string {
    const baseClasses = 'message-item';
    const classes = [baseClasses];

    // Додаємо класи для статусу читання
    switch (this.message.readStatus) {
      case 'unread':
        classes.push('message-unread');
        break;
      case 'unread-notification':
        classes.push('message-unread-notification');
        break;
      default:
        classes.push('message-default');
    }

    // Додаємо клас для вибраного стану
    if (this.message.isSelected) {
      classes.push('message-selected');
    }

    return classes.join(' ');
  }

  get hasNotificationIcon(): boolean {
    return this.message.readStatus === 'unread-notification' && this.showNotificationIcon;
  }

  get isUnread(): boolean {
    return this.message.readStatus === 'unread' || this.message.readStatus === 'unread-notification';
  }

  get backgroundColorClass(): string {
    if (this.isUnread) {
      return 'bg-unread';
    }
    return 'bg-default';
  }
}
