import {Routes} from '@angular/router';
import {RegisterComponent} from "./core/components/register/register.component";
import {LoginComponent} from "./core/components/login/login.component";
import {ChatComponent} from "./comments/components/chat/chat.component";

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {
    path: 'comments',
    loadChildren: () => import('./comments/comments.routes').then(m => m.COMMENTS_ROUTES)
  },
  {
    path: 'chat', component: ChatComponent
  },
  {path: '', redirectTo: 'login', pathMatch: 'full'}
];
