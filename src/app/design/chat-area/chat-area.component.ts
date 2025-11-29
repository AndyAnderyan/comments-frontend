import {Component, ElementRef, inject, signal, ViewChild} from '@angular/core';
import {CommentFormComponent} from "../comment-form/comment-form.component";
import {CommonModule} from "@angular/common";
import {CommentActions} from "../../comments/state/comment.actions";
import {Store} from "@ngrx/store";
import {selectChatMessages, selectEntities, selectSelectedTopicId} from "../../comments/state/comment.selectors";
import {Comment} from "../../comments/models/comment.model";

@Component({
  selector: 'app-chat-area',
  standalone: true,
  imports: [CommonModule, CommentFormComponent],
  templateUrl: './chat-area.component.html',
  styleUrl: './chat-area.component.css'
})
export class ChatAreaComponent {
  private store = inject(Store);

  messages$ = this.store.select(selectChatMessages);
  selectedTopicId$ = this.store.select(selectSelectedTopicId);

  // Для отримання даних батьківського повідомлення (щоб показати "Reply to")
  commentEntities$ = this.store.select(selectEntities);

  // Стан для "Відповісти на повідомлення"
  replyToMessage = signal<Comment | null>(null);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  private shouldScroll = false;

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  // Метод для відправки повідомлення
  sendMessage(data: { text: string; recipientsIds: string[] }, topicId: string | null) {
    if (topicId === 'new') {
      // Створення нової теми
      this.store.dispatch(CommentActions.addComment({
        dto: {
          text: data.text,
          notifyUserIds: data.recipientsIds,
          // ... objectTypeId/objectId будуть взяті з ефекту або треба передати сюди через Input
          // Для прикладу вважаємо що ефект знає контекст, або передаємо явно
        } as any // Type cast спрощено
      }));
    } else if (topicId) {
      // Відповідь у чаті
      this.store.dispatch(CommentActions.addComment({
        dto: {
          text: data.text,
          notifyUserIds: data.recipientsIds,
          parentId: this.replyToMessage() ? this.replyToMessage()!.id : topicId, // Або тема, або конкретне повідомлення
          // ... context
        } as any
      }));
    }

    this.replyToMessage.set(null);
    this.shouldScroll = true;
  }

  setReply(message: Comment) {
    this.replyToMessage.set(message);
  }

  cancelReply() {
    this.replyToMessage.set(null);
  }

  scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
