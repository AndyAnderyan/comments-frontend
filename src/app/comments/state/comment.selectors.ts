import {adapter, commentsFeature} from "./comment.reducer";
import {createSelector} from "@ngrx/store";
import {Comment} from "../models/comment.model"

// Отримуємо селектор усієї фічі (Feature selector)
const { selectCommentsState } = commentsFeature

// Отримуємо селектори адаптера (selectAll, selectEntities, etc.)
// Ми передаємо selectCommentsState, щоб адаптер знав, де шукати дані
export const { selectEntities, selectAll: selectAllComments } = adapter.getSelectors(selectCommentsState);
export const selectSelectedTopicId = commentsFeature.selectSelectedTopicId;

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

// Селектор для СПИСКУ ТЕМ (тільки рівень 0)
export const selectTopics = createSelector(
  selectCommentsForCurrentObject, // (це той, що фільтрує по objectId/layerId)
  (comments) => {
    return comments
      .filter(c => c.level === 0 || !c.parentId) // Тільки кореневі
      .sort((a, b) => {
        // Спочатку Pinned, потім новіші
        if (a.isPinned) return -1;
        if (b.isPinned) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }
);

// 2. Селектор для ЧАТУ (повідомлення вибраної теми)
export const selectChatMessages = createSelector(
  selectCommentsForCurrentObject,
  selectSelectedTopicId,
  (allComments, topicId) => {
    if (!topicId) return [];

    // Знаходимо всі коментарі, які належать до цієї гілки
    // Оскільки бекенд може повертати плоский список або дерево,
    // найнадійніше - рекурсивно знайти всіх нащадків або фільтрувати,
    // якщо ми знаємо threadId (якого немає в моделі),
    // тому робимо "Flatten" дерева, яке починається з topicId.

    const topic = allComments.find(c => c.id === topicId);
    if (!topic) return [];

    // Додаємо сам топік як перше повідомлення (опціонально, як заголовок)
    // або просто беремо всіх нащадків.
    // Припустимо, що allComments містить все необхідне.

    // Варіант A: Якщо allComments це плоский список всіх коментарів об'єкта
    // Нам треба зібрати дерево для topicId і розгорнути його в плоский список.

    // Будуємо мапу для швидкого пошуку
    const commentsByParent = new Map<string, Comment[]>();
    allComments.forEach(c => {
      if (c.parentId) {
        const children = commentsByParent.get(c.parentId) || [];
        children.push(c);
        commentsByParent.set(c.parentId, children);
      }
    });

    // Рекурсивно збираємо всіх нащадків
    const chatMessages: Comment[] = [topic]; // Починаємо з теми
    const queue = [topic.id];

    while(queue.length > 0) {
      const currentId = queue.shift()!;
      const children = commentsByParent.get(currentId) || [];
      chatMessages.push(...children);
      children.forEach(c => queue.push(c.id));
    }

    // Сортуємо хронологічно (старі зверху -> нові знизу, як в чаті)
    return chatMessages.sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }
);

// Селектор для отримання батьківського повідомлення (для відображення Reply UI)
// Ми будемо використовувати selectEntities в компоненті, щоб швидко знайти parent по ID.
