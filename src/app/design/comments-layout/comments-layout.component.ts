import {Component, inject, Input, OnInit} from '@angular/core';
import {CommentActions} from "../../comments/state/comment.actions";
import {Store} from "@ngrx/store";
import {ChatAreaComponent} from "../chat-area/chat-area.component";
import {TopicListComponent} from "../../comments/components/topic-list/topic-list.component";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-comments-layout',
  standalone: true,
  imports: [
    CommonModule,
    ChatAreaComponent,
    TopicListComponent
  ],
  templateUrl: './comments-layout.component.html',
  styleUrl: './comments-layout.component.css'
})
export class CommentsLayoutComponent implements OnInit{
  @Input({ required: true }) objectTypeId!: string;
  @Input({ required: true }) objectId!: string;

  private store = inject(Store);

  ngOnInit() {
    this.store.dispatch(CommentActions.loadComments({
      objectTypeId: this.objectTypeId,
      objectId: this.objectId
    }));
  }
}
