import {adapter, commentsFeature} from "./comment.reducer";
import {createSelector} from "@ngrx/store";
import {Comment} from "../models/comment.model"

// Отримуємо селектор усієї фічі (Feature selector)
const { selectCommentsState } = commentsFeature

// Отримуємо селектори адаптера (selectAll, selectEntities, etc.)
// Ми передаємо selectCommentsState, щоб адаптер знав, де шукати дані
const { selectEntities, selectAll: selectAllComments } = adapter.getSelectors(selectCommentsState);

// Селектори для конкретних полів стану (вони згенеровані автоматично createFeature)
export const selectIsLoading = commentsFeature.selectLoading;
export const selectError = commentsFeature.selectError;
export const selectPinnedCommentId = commentsFeature.selectPinnedCommentId;

// Селектор контексту (поточнийй об'єкт)
export const selectCurrentObjectRef = createSelector(
  commentsFeature.selectCurrentObjectTypeId,
  commentsFeature.selectCurrentObjectId,
  (typeId, id) => ({ typeId, id })
);

// Фільтрація коментарів для поточного об'єкта
export const selectCommentsForCurrentObject = createSelector(
  selectAllComments,
  selectCurrentObjectRef,
  (comments, { typeId, id }) => {
    if (!typeId || !id) return [];
    return comments.filter(
      (c) => c.objectTypeId === typeId && c.objectId === id
    );
  }
);

// МЕМОІЗОВАНИЙ селектор для побудови дерева (Thread -> Replies)
// Це складна операція, тому важливо, щоб вона виконувалась тільки при зміні вхідних даних
export const selectCommentTree = createSelector(
  selectCommentsForCurrentObject,
  selectPinnedCommentId,
  (comments, pinnedId) => {
    const commentMap = new Map<string, Comment>();
    const roots: Comment[] = [];

    // Створюємо копії об'єктів, щоб не мутувати стан, і ініціалізуємо replies
    comments.forEach((c) => {
      commentMap.set(c.id, { ...c, replies: [] })
    });

    commentMap.forEach((comment) => {
      if (comment.parentId && commentMap.has(comment.parentId)) {
        const parent = commentMap.get(comment.parentId)!;
        parent.replies?.push(comment);
        parent.replies?.sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      } else {
        // Це коментарі верхнього рівня
        roots.push(comment)
      }
    });

    // - Спочатку Pinned (якщо є)
    // - Потім інші за спаданням дати (нові зверху)
    return roots.sort((a, b) => {
      if (a.id === pinnedId) return -1;
      if (a.id === pinnedId) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
  }
)

