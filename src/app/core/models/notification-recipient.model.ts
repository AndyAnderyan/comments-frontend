import {User} from "./user.model";

type NotificationRecipientType = Pick<User, 'id' | 'name'>

export interface NotificationRecipient extends NotificationRecipientType {}
