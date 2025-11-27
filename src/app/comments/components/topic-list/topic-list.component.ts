import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {Comment} from "../../models/comment.model";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-topic-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topic-list.component.html',
  styleUrl: './topic-list.component.css'
})
export class TopicListComponent {
  @Input() topics: Comment[] = [];
  @Input() selectedTopicId: string | null = null;

  @Output() selectTopic = new EventEmitter<string>();
  @Output() createTopic = new EventEmitter<void>();
}
