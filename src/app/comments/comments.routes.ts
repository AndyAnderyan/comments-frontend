import {Routes} from "@angular/router";
import {CommentsWrapperComponent} from "./components/comments-wrapper/comments-wrapper.component";
import {provideState} from "@ngrx/store";
import {commentsFeature} from "./state/comment.reducer";
import {provideEffects} from "@ngrx/effects";
import {CommentEffects} from "./state/comment.effects";
import {CommentsLayoutComponent} from "./components/comments-layout/comments-layout.component";
import {ChatComponent} from "./components/chat/chat.component";
import {MessageItemComponent} from "./components/message-item/message-item.component";
import {ChatInputComponent} from "./components/chat-input/chat-input.component";
import {TopicListComponent} from "./components/topic-list/topic-list.component";
import {MessageListComponent} from "./components/message-list/message-list.component";
import {TopicFormDemoComponent} from "./components/topic-form-demo/topic-form-demo.component";
import {TopicFormComponent} from "./components/topic-form/topic-form.component";

export const COMMENTS_ROUTES: Routes = [
  {
    path: 'topic',
    component: TopicFormComponent,
  },
  {
    path: ':objectTypeId/:objectId',
    component: ChatComponent,
    // Надаємо стан та ефекти ТІЛЬКИ для цього маршруту та його дочірніх
    providers: [
      provideState(commentsFeature),
      provideEffects(CommentEffects)
    ]
  },
  {
    path: ':objectTypeId/:objectId',
    component: CommentsWrapperComponent,
    // Надаємо стан та ефекти ТІЛЬКИ для цього маршруту та його дочірніх
    providers: [
      provideState(commentsFeature),
      provideEffects(CommentEffects)
    ]
  }
]
