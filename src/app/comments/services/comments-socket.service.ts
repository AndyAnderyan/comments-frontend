import {effect, inject, Injectable, OnDestroy} from '@angular/core';
import {AuthService} from "../../core/services/auth.service";
import {EntityName} from "../dicts/entity-name.enum";
import {EventType} from "../dicts/event-type.enum";
import {CommentCreatedPayload} from "../payloads/comment-created.payload";
import {Subject} from "rxjs";
import {CommentHiddenPayload} from "../payloads/comment-hidden.payload";
import {CommentDeletedPayload} from "../payloads/comment-deleted.payload";
import {CommentPinnedPayload} from "../payloads/comment-pinned.payload";
import {UnreadCountPayload} from "../payloads/unread-count.payload";
import {CommentUpdatedPayload} from "../payloads/comment-updated.payload";
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class CommentsSocketService implements OnDestroy {
  private socketUrl = 'http://localhost:3000/notifications'
  private socket: Socket | undefined;
  private authService = inject(AuthService)

  private onCommentCreated = new Subject<CommentCreatedPayload>();
  private onCommentUpdated = new Subject<CommentUpdatedPayload>();
  private onCommentHidden = new Subject<CommentHiddenPayload>();
  private onCommentDeleted = new Subject<CommentDeletedPayload>();
  private onCommentPinned = new Subject<CommentPinnedPayload>();
  private onUnreadCountUpdated = new Subject<UnreadCountPayload>();

  commentCreated$ = this.onCommentCreated.asObservable();
  commentUpdated$ = this.onCommentUpdated.asObservable();
  commentHidden$ = this.onCommentHidden.asObservable();
  commentDeleted$ = this.onCommentHidden.asObservable();
  commentPinned$ = this.onCommentPinned.asObservable();
  unreadCountUpdated$ = this.onUnreadCountUpdated.asObservable();

  constructor() {

    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.connect();
      } else {
        this.disconnect();
      }
    })
  }

  private connect() {
    const token = this.authService.getToken();

    // Якщо токена немає або ми вже підключені, нічого не робимо
    if (!token || (this.socket && this.socket.connected)) return;

    console.log('[Socket] Connecting with token...');

    // Підключення до простору імен 'notifications'
    this.socket = io('http://localhost:3000/notifications', {
      auth: { token }, // Передаємо справжній токен
      transports: ['websocket'],
      forceNew: true
    });

    this.setupListeners();

    this.socket.on('connect_error', (err) => {
      console.error('[Socket] Connection Error:', err.message);
    });
  }

  private disconnect() {
    if (this.socket) {
      console.log('[Socket] Disconnecting...');
      this.socket.disconnect();
      this.socket = undefined;
    }
  }

  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on(`${EntityName.comment}.${EventType.created}`, (payload: CommentCreatedPayload) => {
      this.onCommentCreated.next(payload)
    });

    this.socket.on(`${EntityName.comment}.${EventType.updated}`, (payload: CommentUpdatedPayload) => {
      this.onCommentUpdated.next(payload)
    })

    this.socket.on(`${EntityName.comment}.${EventType.hidden}`, (payload: CommentHiddenPayload) => {
      this.onCommentHidden.next(payload)
    })

    this.socket.on(`${EntityName.comment}.${EventType.deleted}`, (payload: CommentDeletedPayload) => {
      this.onCommentDeleted.next(payload)
    })

    this.socket.on(`${EntityName.comment}.${EventType.pinned}`, (payload: CommentPinnedPayload) => {
      this.onCommentPinned.next(payload)
    })

    this.socket.on(`${EntityName.unreadCount}.${EventType.updated}`, (payload: UnreadCountPayload) => {
      this.onUnreadCountUpdated.next(payload)
    })

  }

  ngOnDestroy() {
    this.disconnect();
  }
}
