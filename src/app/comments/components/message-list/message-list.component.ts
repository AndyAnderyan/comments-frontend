import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output, QueryList, SimpleChanges,
  ViewChild, ViewChildren
} from '@angular/core';
import {MessageItemComponent} from "../message-item/message-item.component";
import {CommonModule} from "@angular/common";
import {Comment} from "../../models/comment.model";

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [
    CommonModule,
    MessageItemComponent
  ],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent implements AfterViewChecked, OnChanges {
  @Input() messages: Comment[] = [];
  @Input() currentUserId: string | undefined = undefined;

  @Output() pin = new EventEmitter<Comment>();
  @Output() hide = new EventEmitter<Comment>();
  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Comment>();
  @Output() reply = new EventEmitter<Comment>();
  @Output() quoteClick = new EventEmitter<string>(); // ID батьківського коментаря

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  private shouldScroll = true;

  // Отримуємо доступ до всіх елементів повідомлень у списку
  @ViewChildren('messageItem', { read: ElementRef }) messageElements!: QueryList<ElementRef>;

  ngOnChanges(changes: SimpleChanges) {
    // Якщо список повідомлень змінився і додались нові - скролимо вниз
    if (changes['messages'] && !changes['messages'].firstChange) {
      const prev = changes['messages'].previousValue || [];
      const curr = changes['messages'].currentValue || [];
      if (curr.length > prev.length) {
        this.shouldScroll = true;
      }
    } else if (changes['messages'] && changes['messages'].firstChange) {
      this.shouldScroll = true;
    }
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  scrollToMessage(messageId: string) {
    // Знаходимо індекс повідомлення в масиві
    const index = this.messages.findIndex(m => m.id === messageId);

    if (index !== -1 && this.messageElements) {
      const element = this.messageElements.toArray()[index].nativeElement;

      // Скролимо до елемента
      element.scrollIntoView({ behavior: 'smooth', block: 'center'})

      // Додаємо кла для підсвічування
      element.classList.add('highlight-message');

      // Прибираємо клас через 1.5 секунди
      setTimeout(() => {
        element.classList.remove('highlight-message');
      }, 1500)

      // Скасовуємо авто-скрол вниз, щоб не збити позицію
      this.shouldScroll = false;
    } else {
      console.log(`Message with id ${messageId} not found in current view`);
    }
  }
}
