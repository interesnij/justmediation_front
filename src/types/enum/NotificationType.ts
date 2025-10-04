/**
 * Notification types.
 * @see NotificationTypeDto Notification type dto.
 */
export enum NotificationType {
  /** mediator created a post. */
  NewMediatorPost = 'NewMediatorPost',
  /** mediator created an event. */
  NewEvent = 'NewEvent',
  /** mediator uploaded a document. */
  DocumentShared = 'DocumentShared',
  /** New message. */
  NewMessage = 'NewMessage',
  /** Matter status updated. */
  MatterStatusUpdated = 'MatterStatusUpdated',
  /** Chat created. */
  NewChat = 'NewChat',
  /** New opportunity for mediator. */
  NewOpportunity = 'NewOpportunity',
  /** New post created by mediator. */
  NewTopicPost = 'NewTopicPost',
  /** Video call started. */
  NewVideoCall = 'NewVideoCall',
  /** mediator was invited to group chat. */
  NewGroupChat = 'NewGroupChat',
  /** Matter was shared with user. */
  MatterShared = 'MatterShared',
}
