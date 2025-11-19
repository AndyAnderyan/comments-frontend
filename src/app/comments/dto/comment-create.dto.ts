import {ObjectRef} from "../../core/models/object-ref.model";

export interface CommentCreateDto extends ObjectRef {
  text: string;
  parentId?: string;
  recipientsIds?: string[];
}
