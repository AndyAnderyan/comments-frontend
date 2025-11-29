import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {Comment} from "../../models/comment.model";
import {CommonModule} from "@angular/common";
import {User} from "../../../core/models/user.model";
import {TopicFormComponent} from "../topic-form/topic-form.component";

@Component({
  selector: 'app-topic-list',
  standalone: true,
  imports: [CommonModule, TopicFormComponent],
  templateUrl: './topic-list.component.html',
  styleUrl: './topic-list.component.css'
})
export class TopicListComponent {
  @Input() topics: Comment[] = [];
  @Input() selectedTopicId: string | null = null;

  @Output() selectTopic = new EventEmitter<string>();
  @Output() createTopicStart = new EventEmitter<void>();
  @Output() createTopicSubmit = new EventEmitter<{ topic: string }>();
  @Output() createTopicCancel = new EventEmitter<void>();

  get isCreating(): boolean {
    return this.selectedTopicId === 'new';
  }
}
