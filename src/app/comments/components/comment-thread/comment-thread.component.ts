import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output, signal} from '@angular/core';
import {CommonModule} from "@angular/common";
import {AuthService} from "../../../core/services/auth.service";
import {Comment} from "../../models/comment.model"
import {CommentFormComponent} from "../comment-form/comment-form.component";

type ThreadAction = 'none' | 'reply' | 'edit';

@Component({
  selector: 'app-comment-thread',
  standalone: true,
  imports: [CommonModule, CommentFormComponent],
  templateUrl: './comment-thread.component.html',
  styleUrl: './comment-thread.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentThreadComponent {
  @Input({ required: true }) comment!: Comment;

  @Output() reply = new EventEmitter<{ parentId: string, text: string, recipientsIds: string[] }>();
  @Output() update = new EventEmitter<{ id: string; text: string; recipientsIds: string[] }>();

  @Output() delete = new EventEmitter<string>();
  @Output() pin = new EventEmitter<Comment>();
  @Output() unpin = new EventEmitter<Comment>();
  @Output() hide = new EventEmitter<Comment>();

  private authService = inject(AuthService);

  activeAction = signal<ThreadAction>('none')

  get isAuthor(): boolean {
    return this.authService.isAuthor(this.comment.authorId);
  }

  get isAdmin(): boolean {
    return this.authService.isAdmin()
  }

  get canReply(): boolean {
    return this.comment.level < 3;
  }

  startReply(): void {
    this.activeAction.set('reply');
  }

  startEdit(): void {
    this.activeAction.set('edit');
  }

  cancelAction(): void {
    this.activeAction.set('none');
  }

  onFormSave(data: { text: string; recipientsIds: string[] }): void {
    const action = this.activeAction();

    if (action === 'reply') {
      this.reply.emit({
        parentId: this.comment.id,
        ...data
      })
    } else if (action === 'edit') {
      this.update.emit({
        id: this.comment.id,
        ...data
      })
    }

    this.activeAction.set('none');
  }

  protected readonly onsubmit = onsubmit;
}
