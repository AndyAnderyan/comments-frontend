import {inject, Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {CommentsApiService} from "../services/comments-api.service";
import {CommentsSocketService} from "../services/comments-socket.service";
import {commentsFeature} from "./comment.reducer";
import {catchError, exhaustMap, filter, map, mergeMap, of, withLatestFrom} from "rxjs";
import {CommentsActions} from "./commentsActions";

@Injectable()
export class CommentEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private apiService = inject(CommentsApiService);
  private socketService = inject(CommentsSocketService);

  private currentObjectRef$ = this.store.select(
    commentsFeature.selectCurrentObjectTypeId
  ).pipe(
    withLatestFrom(this.store.select(commentsFeature.selectCurrentObjectId)),
    map(([objectTypeId, objectId]) => ({objectTypeId, objectId}))
  );

  // HTTP Ефекти
  loadComments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentsActions.loadComments),
      // exhaustMap ігнорує нові запити, поки поточний не завершено
      exhaustMap(({objectTypeId, objectId}) =>
        this.apiService.getComments(objectTypeId, objectId).pipe(
          map(response => CommentsActions.loadCommentsSuccess({response, objectTypeId, objectId})),
          catchError(error => of(CommentsActions.loadCommentsFailure({error: error.message})))
        )
      )
    )
  );

  addComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentsActions.addComment),
      // mergeMap дозволяє паралельні запити
      mergeMap(({dto}) =>
        this.apiService.addComment(dto).pipe(
          map(comment => CommentsActions.addCommentSuccess({comment})),
          catchError(error => of(CommentsActions.addCommentFailure({error: error.message})))
        )
      )
    )
  );

  updateComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentsActions.updateComment),
      mergeMap(({id, dto}) =>
        this.apiService.updateComment(id, dto).pipe(
          map(comment => CommentsActions.updateCommentSuccess({comment})),
          catchError(error => of(CommentsActions.updateCommentFailure({error: error.message})))
        )
      )
    )
  );

  hideComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentsActions.hideComment),
      mergeMap(({comment}) =>
        this.apiService.hideComment(comment.id).pipe(
          map(() => CommentsActions.hideCommentSuccess({id: comment.id})),
          catchError(error => of(CommentsActions.hideCommentFailure({error: error.message})))
        )
      )
    )
  );

  deleteComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentsActions.deleteComment),
      mergeMap(({ id }) =>
        this.apiService.deleteComment(id).pipe(
          map(() => CommentsActions.deleteCommentSuccess({ id })),
          catchError(error => of(CommentsActions.deleteCommentFailure({ error: error.message })))
        )
      )
    )
  );

  pinComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentsActions.pinComment),
      mergeMap(({ comment }) =>
        this.apiService.pinComment(comment.id).pipe(
          map(updatedComment => CommentsActions.pinCommentSuccess({ comment: updatedComment })),
          catchError(error => of(CommentsActions.pinCommentFailure({error: error.message })))
        )
      )
    )
  );

  unpinComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentsActions.unpinComment),
      mergeMap(({ comment }) =>
        this.apiService.unpinComment(comment.id).pipe(
          map(updatedComment => CommentsActions.unpinCommentSuccess({comment: updatedComment })),
          catchError(error => of(CommentsActions.unpinCommentFailure({error: error.message })))
        )
      )
    )
  );

  markAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentsActions.markAsRead),
      mergeMap(({ id }) =>
        this.apiService.markAsRead(id).pipe(
          map(() => CommentsActions.markAsReadSuccess({ id })),
          catchError(error => of(CommentsActions.markAsReadFailure({error: error.message })))
        )
      )
    )
  );

  // WebSocket Ефекти

  // Перетворюємо події з сокет-сервісу на NgRx Actions
  // Ми також фільтруємо події, щоб реагувати тільки на ті,
  // що стосуються поточного об'єкта, який переглядає користувач.

  handleSocketCommentCreated$ = createEffect(() =>
    this.socketService.commentCreated$.pipe(
      withLatestFrom(this.currentObjectRef$),
      filter(([{ comment }, objectRef]) =>
        comment.objectTypeId === objectRef.objectTypeId &&
        comment.objectId === objectRef.objectId
      ),
      map(([{ comment } ]) => CommentsActions.socketCommentReceived({ comment }))
    )
  );

  handleSocketCommentUpdate$ = createEffect(() =>
    this.socketService.commentUpdated$.pipe(
      withLatestFrom(this.currentObjectRef$),
      filter(([{ comment }, objectRef]) =>
        comment.objectTypeId === objectRef.objectTypeId &&
        comment.objectId === objectRef.objectId
      ),
      map(([{comment}]) => CommentsActions.socketCommentUpdated({comment }))
    )
  );

  handleSocketCommentHidden$ = createEffect(() =>
    this.socketService.commentHidden$.pipe(
      withLatestFrom(this.currentObjectRef$),
      filter(([payload, objectRef]) =>
        payload.objectTypeId === objectRef.objectTypeId &&
        payload.objectId === objectRef.objectId
      ),
      map(([payload]) => CommentsActions.socketCommentHidden(payload))
    )
  );

  handleSocketCommentDeleted$ = createEffect(() =>
    this.socketService.commentDeleted$.pipe(
      withLatestFrom(this.currentObjectRef$),
      filter(([payload, objectRef]) =>
        payload.objectTypeId === objectRef.objectTypeId &&
        payload.objectId === objectRef.objectId
      ),
      map(([payload]) => CommentsActions.socketCommentDeleted(payload))
    )
  );

  handleSocketCommentPinned$ = createEffect(() =>
    this.socketService.commentPinned$.pipe(
      withLatestFrom(this.currentObjectRef$),
      filter(([payload, objectRef]) =>
        payload.objectKey.objectTypeId === objectRef.objectTypeId &&
        payload.objectKey.objectId === objectRef.objectId
      ),
      map(([payload]) => CommentsActions.socketCommentPinned({
        ...payload.objectKey,
        pinnedCommentId: payload.pinnedCommentId
      }))
    )
  )

  handleSocketUnreadCount$ = createEffect(() =>
    this.socketService.unreadCountUpdated$.pipe(
      map(payload => CommentsActions.setUnreadCount({count: payload.count }))
    )
  );
}
