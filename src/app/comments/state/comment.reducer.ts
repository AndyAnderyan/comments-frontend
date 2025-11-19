import {createEntityAdapter, EntityAdapter, EntityState} from "@ngrx/entity";
import {Comment} from "../models/comment.model"
import {createFeature, createReducer, on} from "@ngrx/store";
import {CommentsActions} from "./commentsActions";
import {state} from "@angular/animations";

export interface CommentsState extends EntityState<Comment> {
  // Поточний об'єкт
  currentObjectTypeId: string | null;
  currentObjectId: string | null;

  pinnedCommentId: string | null;

  totalCount: number;
  loading: boolean;
  error: string | null;

  unreadNotificationCount: number;
}

// Створюємо EntityAdapter. Він дає нам методи для CRUD-операцій зі станом
export const adapter: EntityAdapter<Comment> = createEntityAdapter<Comment>({
  sortComparer: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
})

export const initialState: CommentsState = adapter.getInitialState({
  currentObjectTypeId: null,
  currentObjectId: null,
  pinnedCommentId: null,
  totalCount: 0,
  loading: false,
  error: null,
  unreadNotificationCount: 0,
})

export const commentsFeature = createFeature({
  name: 'comments',
  reducer: createReducer(
    initialState,

    on(CommentsActions.setObjectContext, (state, {objectTypeId, objectId}) => ({
      ...state,
      currentObjectTypeId: objectTypeId,
      currentObjectId: objectId
    })),

    on(CommentsActions.loadComments, (state, {objectTypeId, objectId}) => ({
      ...adapter.removeAll(state),
      loading: true,
      error: null,
      pinnedCommentId: null,
      totalCount: 0,
      currentObjectTypeId: objectTypeId,
      currentObjectId: objectId,
    })),

    on(CommentsActions.loadCommentsSuccess, (state, {response}) => {
      // Визначаємо чи є закріплений коментар
      const pinned = response.data.find(c => c.isPinned)

      return adapter.setAll(response.data, {
        ...state,
        loading: false,
        totalCount: response.total,
        pinnedCommentId: pinned ? pinned.id : null,
      });
    }),

    on(CommentsActions.loadCommentsFailure, (state, {error}) => ({
      ...state,
      loading: false,
      error,
    })),

    on(CommentsActions.addCommentSuccess, (state, {comment}) => {
      return adapter.addOne(comment, state);
    }),

    on(CommentsActions.updateCommentSuccess, (state, {comment}) => {
      return adapter.updateOne({id: comment.id, changes: comment}, state);
    }),

    // Просто видаляємо замість приховування TODO: треба змінити
    on(CommentsActions.hideCommentSuccess, (state, { id }) => {
      return adapter.removeOne(id, state);
    }),

    on(CommentsActions.deleteCommentSuccess, (state, { id }) => {
      return adapter.removeOne(id, state);
    }),

    on(CommentsActions.pinCommentSuccess, (state, { comment }) => {
      // Знімаємо isPinned з усіх інших
      const updates = state.ids
        .map(id => state.entities[id])
        .filter(c => c?.isPinned)
        .map(c => ({ id: c!.id, changes: { isPinned: false } }));

      // Додаємо isPinned новому
      updates.push({ id: comment.id, changes: { isPinned: true }});

      const newState = adapter.updateMany(updates, state);
      return {
        ...newState,
        pinnedCommentId: comment.id,
      }
    }),

    on(CommentsActions.unpinCommentSuccess, (state, { comment }) => {
      const newState = adapter.updateOne({ id: comment.id, changes: { isPinned: false }}, state);
      return {
        ...newState,
        pinnedCommentId: null,
      };
    }),

    on(CommentsActions.markAsReadSuccess, (state, { id }) => {
      return adapter.updateOne({ id, changes: { isRead: true, isNotifiedToMeAndUnread: false } }, state);
    }),

    // WebSocket

    on(CommentsActions.socketCommentReceived, (state, { comment }) => {
      return adapter.addOne(comment, state);
    }),

    on(CommentsActions.socketCommentUpdated, (state, { comment }) => {
      return adapter.updateOne({ id: comment.id, changes: comment }, state);
    }),

    on(CommentsActions.socketCommentHidden, (state, { id, isHidden }) => {
      return adapter.updateOne({ id, changes: { isHidden } }, state);
    }),

    on(CommentsActions.socketCommentDeleted, (state, { id }) => {
      return adapter.removeOne(id, state);
    }),

    on(CommentsActions.socketCommentPinned, (state, { pinnedCommentId }) => ({
      ...state,
      pinnedCommentId,
    })),

    on(CommentsActions.setUnreadCount, (state, { count }) => ({
      ...state,
      unreadNotificationCount: count,
    }))
  ),

  // Експортуємо селектори, створені 'createFeature' (включаючі ті, що з 'createEntityAdapter')
  // Ми отримуємо: selectAll, selectEntities, selectIds, selectTotal,
  // selectCommentsState, selectLoading, selectError, і. т.д.

  ...adapter.getSelectors()
});
