import {ChangeDetectionStrategy, Component, inject, Input, OnInit, signal, ViewChild} from '@angular/core';
import {ChatInputComponent} from "../chat-input/chat-input.component";
import {MessageListComponent} from "../message-list/message-list.component";
import {TopicListComponent} from "../topic-list/topic-list.component";
import {CommonModule} from "@angular/common";
import {Store} from "@ngrx/store";
import {AuthService} from "../../../core/services/auth.service";
import {Observable} from "rxjs";
import {
  selectChatMessages,
  selectPinnedComment, selectPinnedMessageForCurrentTopic,
  selectSelectedTopicId,
  selectTopics
} from "../../state/comment.selectors";
import {Comment} from "../../models/comment.model";
import {CommentActions} from "../../state/comment.actions";
import {CommentsApiService} from "../../services/comments-api.service";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    TopicListComponent,
    MessageListComponent,
    ChatInputComponent
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  @Input() objectTypeId!: string;
  @Input() objectId!: string;

  private store = inject(Store);
  private authService = inject(AuthService);
  private commentsApiService = inject(CommentsApiService);

  topics$: Observable<Comment[]> = this.store.select(selectTopics);
  selectedTopicId$: Observable<string | null> = this.store.select(selectSelectedTopicId);
  messages$: Observable<Comment[]> = this.store.select(selectChatMessages);

  pinnedMessage$: Observable<Comment | null> = this.store.select(selectPinnedMessageForCurrentTopic);
  users$ = this.commentsApiService.getRecipients();

  currentUserId = this.authService.currentUserId();

  replyToMessage = signal<Comment | null>(null)
  editingMessage = signal<Comment | null>(null)

  @ViewChild(MessageListComponent) messageListComponent!: MessageListComponent;

  ngOnInit() {
    if (this.objectTypeId && this.objectId) {
      this.store.dispatch(CommentActions.loadComments({
        objectTypeId: this.objectTypeId,
        objectId: this.objectId
      }))
    }
  }

  onCreateTopicStart() {
    this.store.dispatch(CommentActions.selectTopic({ id: 'new' }));
  }

  onCreateTopicCancel() {
    this.store.dispatch(CommentActions.selectTopic({ id: null as any }));
  }

  onCreateTopicSubmit(data: { topic: string }) {
    // Формуємо текст. Якщо є заголовок, додаємо його першим рядком

    this.store.dispatch(CommentActions.addComment({
      dto: {
        text: data.topic,
        recipientIds: [],
        objectTypeId: this.objectTypeId,
        objectId: this.objectId,
        parentId: undefined // Це нова тема (корінь)
      }
    }));

    // Після успішного створення ефект може автоматично вибрати нову тему,
    // або ми можемо поки що скинути на 'null', щоб повернутися до списку
    this.onCreateTopicCancel(); // Опціонально, якщо не чекаємо успіху
  }

  onSelectTopic(topicId: string) {
    this.store.dispatch(CommentActions.selectTopic({ id: topicId }));
    this.cancelInputContext();
  }

  onCreateTopic() {
    // 'new' - це спеціальний ID для стану створення нової теми
    this.store.dispatch(CommentActions.selectTopic({ id: 'new' }));
    this.cancelInputContext();
  }

  onSendMessage(event: { text: string; recipientIds: string[] }, currentTopicId: string | undefined) {
    // Якщо currentTopicId === 'new', то parentId = null (нова тема)
    // Інакше parentId = currentTopicId (відповідь у тему)
    if (this.editingMessage()) {
      this.store.dispatch(CommentActions.updateComment({
        id: this.editingMessage()!.id,
        dto: {
          text: event.text,
          recipientIds: event.recipientIds
        }
      }))
    } else {
      let parentId = this.replyToMessage() ? this.replyToMessage()!.id : (currentTopicId === 'new' ? undefined : currentTopicId);

      this.store.dispatch(CommentActions.addComment({
        dto: {
          text: event.text,
          recipientIds: event.recipientIds,
          objectTypeId: this.objectTypeId,
          objectId: this.objectId,
          parentId: parentId
        }
      }));
    }

    this.cancelInputContext();
  }

  // Дії з повідомленнями
  onEdit(comment: Comment) {
    this.editingMessage.set(comment);
    this.replyToMessage.set(null);
  }

  // Відповідь на конкретне повідомлення (цитування)
  // В нашій спрощеній моделі це просто додавання коментаря в ту ж тему
  // Але можна додати логіку "quote" в текст
  onReply(comment: Comment) {
    // Поки що просто фокус на інпут, або можна реалізувати логіку цитування
    this.replyToMessage.set(comment);
    this.editingMessage.set(null);
  }

  onPin(comment: Comment) {
    if (comment.isPinned) {
      this.store.dispatch(CommentActions.unpinComment({ comment }))
    } else {
      this.store.dispatch(CommentActions.pinComment({ comment }))
    }
  }

  onUnpin(comment: Comment) {
    this.store.dispatch(CommentActions.unpinComment({ comment }));
  }

  onUnpinGlobal() {
    // Цей метод викликається з хедера (хрестик на pinned bar)
    // Нам треба ID запіненого коментаря. Ми його можемо взяти з pinnedMessage$ через pipe,
    // але простіше передати в шаблон
  }

  onHide(comment: Comment) { this.store.dispatch(CommentActions.hideComment({ comment })); }

  onDelete(id: string) {
    if(confirm('Видалити цей коментар?')) {
      this.store.dispatch(CommentActions.deleteComment({ id }));
    }
  }

  cancelInputContext() {
    this.replyToMessage.set(null);
    this.editingMessage.set(null);
  }

  scrollToMessage(messageId: string) {
    if (this.messageListComponent) {
      this.messageListComponent.scrollToMessage(messageId);
    }
  }

  onPinnedMessageClick(messageId: string) {
    this.scrollToMessage(messageId);
  }

  onQuoteClick(messageId: string) {
    this.scrollToMessage(messageId);
  }
}

