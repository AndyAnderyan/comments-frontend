import {Routes} from "@angular/router";
import {CommentsWrapperComponent} from "./components/comments-wrapper/comments-wrapper.component";
import {provideState} from "@ngrx/store";
import {commentsFeature} from "./state/comment.reducer";
import {provideEffects} from "@ngrx/effects";
import {CommentEffects} from "./state/comment.effects";
import {CommentsLayoutComponent} from "./components/comments-layout/comments-layout.component";

export const COMMENTS_ROUTES: Routes = [
  {
    path: ':objectTypeId/:objectId',
    component: CommentsLayoutComponent,
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
