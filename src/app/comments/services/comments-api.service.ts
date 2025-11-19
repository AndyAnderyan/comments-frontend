import {inject, Injectable} from '@angular/core';
import {User} from "../../core/models/user.model";
import {UserRole} from "../../core/models/user-role.enum";
import {Comment} from "../models/comment.model"
import {AuthService} from "../../core/services/auth.service";
import {delay, Observable, of} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {PaginatedResponse} from "../../core/models/paginated-response.model";
import {NotificationRecipient} from "../../core/models/notification-recipient.model";
import {CommentCreateDto} from "../dto/comment-create.dto";
import {CommentUpdateDto} from "../dto/comment-update.dto";

@Injectable({
  providedIn: 'root'
})
export class CommentsApiService {

  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private readonly API_URL = 'http://localhost:3000/comments';

  // TODO: (переробити) Отримуємо коментарі
  getComments(objectTypeId: string, objectId: string, page: number = 1, limit: number = 20): Observable<PaginatedResponse<Comment>> {
    let params = new HttpParams()
      .set('objectTypeId', objectTypeId)
      .set('objectId', objectId)
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('sortBy', 'createdAt')
      .set('sortOrder', 'DESC');

    if (this.authService.isAdmin()) {
      params = params.set('isShowHidden', 'true')
    }

    return this.http.get<PaginatedResponse<Comment>>(this.API_URL, {params})
  }

  addComment(payload: CommentCreateDto): Observable<Comment> {
    return this.http.post<Comment>(this.API_URL, payload);
  }

  updateComment(id: string, payload: CommentUpdateDto): Observable<Comment> {
    return this.http.put<Comment>(`${this.API_URL}/${id}`, payload);
  }

  hideComment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`)
  }

  deleteComment(id: string): Observable<void> {
    const params = new HttpParams().set('hardDelete', 'true');
    return this.http.delete<void>(`${this.API_URL}/${id}`, {params})
  }

  pinComment(id: string): Observable<Comment> {
    return this.http.patch<Comment>(`${this.API_URL}/${id}/pin`, {})
  }

  unpinComment(id: string): Observable<Comment> {
    return this.http.patch<Comment>(`${this.API_URL}/${id}/unpin`, {});
  }

  markAsRead(id: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/${id}/read`, {})
  }

  getRecipients(): Observable<NotificationRecipient[]> {
    const mockRecipients: NotificationRecipient[] = [
      { id: 'user-1-uuid', name: 'Адміністратор' },
      { id: 'user-2-uuid', name: 'Іван Франко' },
      { id: 'user-3-uuid', name: 'Леся Українка' },
    ]

    return this.http.get<NotificationRecipient[]>('api/users-mock');
  }
}
