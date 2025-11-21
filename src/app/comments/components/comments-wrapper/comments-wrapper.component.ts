import {ChangeDetectionStrategy, Component, inject, Input, OnInit, signal} from '@angular/core';
import {Store} from "@ngrx/store";
import {CommentActions} from "../../state/comment.actions";
import {Comment} from "../../models/comment.model"
import {selectCommentTree, selectError, selectIsLoading} from "../../state/comment.selectors";
import {Observable} from "rxjs";
import {AsyncPipe, CommonModule} from "@angular/common";
import {CommentListComponent} from "../comment-list/comment-list.component";
import {NotificationRecipient} from "../../../core/models/notification-recipient.model";
import {CommentFormComponent} from "../comment-form/comment-form.component";

@Component({
  selector: 'app-comments-wrapper',
  standalone: true,
  imports: [AsyncPipe, CommonModule, CommentListComponent, CommentFormComponent],
  templateUrl: './comments-wrapper.component.html',
  styleUrl: './comments-wrapper.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentsWrapperComponent implements OnInit {
  @Input({required: true}) objectTypeId!: string;
  @Input({required: true}) objectId!: string;

  store: Store = inject(Store)

  // Сигнали/Observable для шаблону
  comments$: Observable<Comment[]> = this.store.select(selectCommentTree);
  loading$: Observable<boolean> = this.store.select(selectIsLoading);
  error$: Observable<string | null> = this.store.select(selectError);

  showAddForm = signal(false);

  ngOnInit(): void {
    console.log('start')
    // Ініціалізуємо контекст та завантажуємо дані
    this.store.dispatch(CommentActions.loadComments({
      objectTypeId: this.objectTypeId,
      objectId: this.objectId
    }));
  }

  // Додавання кореневого коментаря
  onAddComment(data: { text: string; recipientsIds: string[] }): void {
    this.store.dispatch(CommentActions.addComment({
      dto: {
        text: data.text,
        recipientsIds: data.recipientsIds,
        objectTypeId: this.objectTypeId,
        objectId: this.objectId,
        parentId: undefined // Це корінь
      }
    }));
    this.showAddForm.set(false);
  }

// Додавання відповіді
  onReply(data: { parentId: string | null; text: string; recipientsIds: string[] }): void {
    this.store.dispatch(CommentActions.addComment({
      dto: {
        text: data.text,
        recipientsIds: data.recipientsIds,
        objectTypeId: this.objectTypeId,
        objectId: this.objectId,
        parentId: data.parentId + '' // Це відповідь
      }
    }));
  }

  // Редагування
  onUpdate(data: { id: string; text: string; recipientsIds: string[] }): void {
    this.store.dispatch(CommentActions.updateComment({
      id: data.id,
      dto: {
        text: data.text,
        recipientsIds: data.recipientsIds
      }
    }));
  }

  onDelete(id: string) {
    if (confirm('Ви впевнені, що хочете видалити цей коментар? Це видалить і всі відповіді.')) {
      this.store.dispatch(CommentActions.deleteComment({id}));
    }
  }

  onPin(comment: Comment) {
    this.store.dispatch(CommentActions.pinComment({comment}));
  }

  onUnpin(comment: Comment) {
    this.store.dispatch(CommentActions.unpinComment({comment}));
  }

  onHide(comment: Comment) {
    this.store.dispatch(CommentActions.hideComment({comment}));
  }
}
