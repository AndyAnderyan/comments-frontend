import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommentThreadComponent} from "../comment-thread/comment-thread.component";
import {CommonModule} from "@angular/common";
import {Comment} from "../../comments/models/comment.model";

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [CommonModule, CommentThreadComponent],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommentListComponent {
  @Input({ required: true }) comments: Comment[] = [];

  @Output() reply = new EventEmitter<{ parentId: string, text: string, recipientsIds: string[] }>();
  @Output() edit = new EventEmitter<{ id: string; text: string; recipientsIds: string[] }>();
  @Output() delete = new EventEmitter<string>();
  @Output() pin = new EventEmitter<Comment>();
  @Output() unpin = new EventEmitter<Comment>();
  @Output() hide = new EventEmitter<Comment>();
  @Output() update = new EventEmitter<{ id: string; text: string; recipientsIds: string[] }>();
}
