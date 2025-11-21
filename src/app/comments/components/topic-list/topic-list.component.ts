import {Component, inject} from '@angular/core';
import {selectSelectedTopicId, selectTopics} from "../../state/comment.selectors";
import {Store} from "@ngrx/store";
import {CommentActions} from "../../state/comment.actions";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-topic-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topic-list.component.html',
  styleUrl: './topic-list.component.css'
})
export class TopicListComponent {
  private store = inject(Store);
  topics$ = this.store.select(selectTopics);
  selectedTopicId$ = this.store.select(selectSelectedTopicId);

  selectTopic(id: string) {
    this.store.dispatch(CommentActions.selectTopic({ id }));
  }

  createNewTopic() {
    // Логіка відкриття форми створення нової теми (можна через діалог або вибрати null ID)
    // Для простоти - скидаємо вибір теми, і ChatArea покаже форму "Створити нову тему"
    this.store.dispatch(CommentActions.selectTopic({ id: 'new' }));
  }
}
