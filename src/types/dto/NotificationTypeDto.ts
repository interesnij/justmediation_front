/** Notification types dto. */
export type NotificationTypeDto =
  'new_mediator_post' | // mediator created a post.
  'new_mediator_event' | // mediator created an event.
  'document_shared_by_mediator' | // mediator uploaded a document.
  'new_message' | // New message.
  'matter_status_update' | // Matter status updated.
  'new_chat' | // Chat created.
  'new_opportunities' | // New opportunity for mediator.
  'new_post' | // New post created by mediator.
  'new_video_call' | // Video call started.
  'new_group_chat' | // mediator was invited to the group chat.
  'new_matter_shared'; // Matter is shared for the user.
