import {createActionGroup, props} from "@ngrx/store";
import {PaginatedResponse} from "../../core/models/paginated-response.model";
import {Comment} from "../models/comment.model";
import {CommentCreateDto} from "../dto/comment-create.dto";
import {CommentUpdateDto} from "../dto/comment-update.dto";

export const CommentActions = createActionGroup({
  source: 'Comments API',
  events: {
    // Додаємо в групу подій
    'Select Topic': props<{ id: string }>(),

    // ініціалізація контексту (який об'єкт ми дивимось)
    'Set Object Context': props<{ objectTypeId: string, objectId: string }>(),

    // HTTP
    'Load Comments': props<{ objectTypeId: string; objectId: string; }>(),
    'Load Comments Success': props<{ response: PaginatedResponse<Comment>; objectTypeId: string; objectId: string; }>(),
    'Load Comments Failure': props<{ error: string }>(),

    'Add Comment': props<{ dto: CommentCreateDto }>(),
    'Add Comment Success': props<{ comment: Comment; }>(),
    'Add Comment Failure': props<{ error: string; }>(),

    'Update Comment': props<{ id: string; dto: CommentUpdateDto; }>(),
    'Update Comment Success': props<{ comment: Comment; }>(),
    'Update Comment Failure': props<{ error: string; }>(),

    'Hide Comment': props<{ comment: Comment; }>(),
    'Hide Comment Success': props<{ id: string; }>(),
    'Hide Comment Failure': props<{ error: string; }>(),

    'Delete Comment': props<{ id: string; }>(),
    'Delete Comment Success': props<{ id: string; }>(),
    'Delete Comment Failure': props<{ error: string; }>(),

    'Pin Comment': props<{ comment: Comment; }>(),
    'Pin Comment Success': props<{ comment: Comment; }>(),
    'Pin Comment Failure': props<{ error: string; }>(),

    'Unpin Comment': props<{ comment: Comment; }>(),
    'Unpin Comment Success': props<{ comment: Comment; }>(),
    'Unpin Comment Failure': props<{ error: string; }>(),

    'Mark As Read': props<{ id: string; }>(),
    'Mark As Read Success': props<{ id: string; }>(),
    'Mark As Read Failure': props<{ error: string; }>(),

    // WebSocket
    'Socket Comment Received': props<{ comment: Comment; }>(),
    'Socket Comment Updated': props<{ comment: Comment; }>(),
    'Socket Comment Hidden': props<{ id: string, isHidden: boolean, objectTypeId: string, objectId: string; }>(),
    'Socket Comment Deleted': props<{ id: string; objectTypeId: string; objectId: string; }>(),
    'Socket Comment Pinned': props<{ objectTypeId: string, objectId: string; pinnedCommentId: string | null; }>(),

    // WebSocket + HTTP
    'Set Unread Count': props<{ count: number; }>(),
  }
})
