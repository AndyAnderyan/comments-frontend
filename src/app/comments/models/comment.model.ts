import {ObjectRef} from "../../core/models/object-ref.model";
import {User} from "../../core/models/user.model";
import {NotificationRecipient} from "../../core/models/notification-recipient.model";

export interface Comment extends ObjectRef{
  id: string;
  text: string;

  author: Pick<User, 'id' | 'name'>;
  authorId: string;

  createdAt: string;
  updatedAt: string | null;

  parentId: string | null;
  level: number;

  recipients: NotificationRecipient[];
  recipientsIds: string[];

  isPinned: boolean;
  isHidden: boolean;
  isRead?: boolean;
  isNotifiedToMeAndUnread: boolean;

  repliesCount?: number;
  replies?: Comment[];
}

