import {inject, Injectable} from "@angular/core";
import {Actions, createEffect, ofType} from "@ngrx/effects";
import {Store} from "@ngrx/store";
import {CommentsApiService} from "../services/comments-api.service";
import {CommentsSocketService} from "../services/comments-socket.service";
import {commentsFeature} from "./comment.reducer";
import {catchError, exhaustMap, filter, map, mergeMap, of, withLatestFrom} from "rxjs";
import {CommentActions} from "./comment.actions";

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
      ofType(CommentActions.loadComments),
      // exhaustMap ігнорує нові запити, поки поточний не завершено
      exhaustMap(({objectTypeId, objectId}) =>
        this.apiService.getComments(objectTypeId, objectId).pipe(
          map(response => CommentActions.loadCommentsSuccess({response, objectTypeId, objectId})),
          catchError(error => of(CommentActions.loadCommentsFailure({error: error.message})))
        )
      )
    )
  );

  addComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentActions.addComment),
      // mergeMap дозволяє паралельні запити
      mergeMap(({dto}) =>
        this.apiService.addComment(dto).pipe(
          map(comment => CommentActions.addCommentSuccess({comment})),
          catchError(error => of(CommentActions.addCommentFailure({error: error.message})))
        )
      )
    )
  );

  updateComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentActions.updateComment),
      mergeMap(({id, dto}) =>
        this.apiService.updateComment(id, dto).pipe(
          map(comment => CommentActions.updateCommentSuccess({comment})),
          catchError(error => of(CommentActions.updateCommentFailure({error: error.message})))
        )
      )
    )
  );

  hideComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentActions.hideComment),
      mergeMap(({comment}) =>
        this.apiService.hideComment(comment.id).pipe(
          map(() => CommentActions.hideCommentSuccess({id: comment.id})),
          catchError(error => of(CommentActions.hideCommentFailure({error: error.message})))
        )
      )
    )
  );

  deleteComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentActions.deleteComment),
      mergeMap(({ id }) =>
        this.apiService.deleteComment(id).pipe(
          map(() => CommentActions.deleteCommentSuccess({ id })),
          catchError(error => of(CommentActions.deleteCommentFailure({ error: error.message })))
        )
      )
    )
  );

  pinComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentActions.pinComment),
      mergeMap(({ comment }) =>
        this.apiService.pinComment(comment.id).pipe(
          map(updatedComment => CommentActions.pinCommentSuccess({ comment: updatedComment })),
          catchError(error => of(CommentActions.pinCommentFailure({error: error.message })))
        )
      )
    )
  );

  unpinComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentActions.unpinComment),
      mergeMap(({ comment }) =>
        this.apiService.unpinComment(comment.id).pipe(
          map(updatedComment => CommentActions.unpinCommentSuccess({comment: updatedComment })),
          catchError(error => of(CommentActions.unpinCommentFailure({error: error.message })))
        )
      )
    )
  );

  markAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CommentActions.markAsRead),
      mergeMap(({ id }) =>
        this.apiService.markAsRead(id).pipe(
          map(() => CommentActions.markAsReadSuccess({ id })),
          catchError(error => of(CommentActions.markAsReadFailure({error: error.message })))
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
      map(([{ comment } ]) => CommentActions.socketCommentReceived({ comment }))
    )
  );

  handleSocketCommentUpdate$ = createEffect(() =>
    this.socketService.commentUpdated$.pipe(
      withLatestFrom(this.currentObjectRef$),
      filter(([{ comment }, objectRef]) =>
        comment.objectTypeId === objectRef.objectTypeId &&
        comment.objectId === objectRef.objectId
      ),
      map(([{comment}]) => CommentActions.socketCommentUpdated({comment }))
    )
  );

  handleSocketCommentHidden$ = createEffect(() =>
    this.socketService.commentHidden$.pipe(
      withLatestFrom(this.currentObjectRef$),
      filter(([payload, objectRef]) =>
        payload.objectTypeId === objectRef.objectTypeId &&
        payload.objectId === objectRef.objectId
      ),
      map(([payload]) => CommentActions.socketCommentHidden(payload))
    )
  );

  handleSocketCommentDeleted$ = createEffect(() =>
    this.socketService.commentDeleted$.pipe(
      withLatestFrom(this.currentObjectRef$),
      filter(([payload, objectRef]) =>
        payload.objectTypeId === objectRef.objectTypeId &&
        payload.objectId === objectRef.objectId
      ),
      map(([payload]) => CommentActions.socketCommentDeleted(payload))
    )
  );

  handleSocketCommentPinned$ = createEffect(() =>
    this.socketService.commentPinned$.pipe(
      withLatestFrom(this.currentObjectRef$),
      filter(([payload, objectRef]) =>
        payload.objectKey.objectTypeId === objectRef.objectTypeId &&
        payload.objectKey.objectId === objectRef.objectId
      ),
      map(([payload]) => CommentActions.socketCommentPinned({
        ...payload.objectKey,
        pinnedCommentId: payload.pinnedCommentId
      }))
    )
  )

  handleSocketUnreadCount$ = createEffect(() =>
    this.socketService.unreadCountUpdated$.pipe(
      map(payload => CommentActions.setUnreadCount({count: payload.count }))
    )
  );
}
