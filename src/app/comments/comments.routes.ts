import {Routes} from "@angular/router";
import {provideState} from "@ngrx/store";
import {commentsFeature} from "./state/comment.reducer";
import {provideEffects} from "@ngrx/effects";
import {CommentEffects} from "./state/comment.effects";
import {ChatComponent} from "./components/chat/chat.component";
import {UserSelectorComponent} from "./components/user-selector/user-selector.component";

export const COMMENTS_ROUTES: Routes = [
  {
    path: 'test',
    component: UserSelectorComponent,
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
]
