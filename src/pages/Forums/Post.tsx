import React, { useState, useRef, RefObject } from "react";
import { RouteComponentProps, useParams, navigate, useLocation } from "@reach/router";
import FollowersIcon from "assets/icons/followers.svg";
import {
  Button,
  User,
  Textarea,
  Reply,
  Breadcrumb,
  Folder,
  FolderItem,
  IconButton,
  RiseLoader,
} from "components";
import { useQuery } from "react-query";
import { ForumsLayout } from "layouts";
import { useModal, useInput } from "hooks";
import {
  getPostById,
  getForumComments,
  createForumComment,
  followPost,
  unfollowPost,
  addIndustryContactToMediator,
  createChat
} from "api";
import { EditPostModal } from "modals";
import { useAuthContext } from "contexts";
import { getUserName } from "helpers";
import { format } from "date-fns";
import numeral from "numeral";
import "./style.scss";

export const PostPage: React.FunctionComponent<RouteComponentProps> = () => {
  const lastReplayRef: RefObject<HTMLSpanElement> = useRef<HTMLSpanElement>(null);
  const reply = useInput("");
  const params = useParams();
  const location = useLocation();
  const editPostModal = useModal();
  const [isReplying, setIsReplying] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const { userType, userId: myId } = useAuthContext();
  const [isCreatingChat, startCreatingChat] = useState(false);
  const {
    isLoading: isPostLoading,
    isError: isPostError,
    error: postError,
    data: post,
    refetch: refetchPost,
  } = useQuery<any, Error>(["post", params.id], () => getPostById(params.id), {
    keepPreviousData: true,
  });
  const {
    isLoading: isCommentsLoading,
    isError: isCommentsError,
    error: commentsError,
    data: comments,
    refetch: refetchComments,
  } = useQuery<{ results: any[]; count: number }, Error>(
    ["post-comments", params.id],
    () => getForumComments({ post: params.id, ordering: 'created' }),
    {
      keepPreviousData: true,
    }
  );

  const handleReply = async () => {
    setIsReplying(true);
    await createForumComment({
      post: post?.id,
      text: reply.value,
    });
    refetchComments();
    setIsReplying(false);
    reply.onChange("");
  };

  const handleFollowPost = async (type) => {
    setIsFollowing(true);
    if (!type) {
      await followPost(post?.id);
    } else {
      await unfollowPost(post?.id);
    }
    refetchPost();
    setIsFollowing(false);
  };

  const handleJumpToLastReply = (): void => {
    lastReplayRef?.current?.scrollIntoView({ behavior: "smooth" })    
  }

  const handleStartChat = async (userId: number, targetUserType: string) => { // [NEED] add user type to object to allow start chat "as opportunity" or "network" 
    startCreatingChat(true)
    // create industry contact 
    if (targetUserType !== 'client') {
      await addIndustryContactToMediator(myId, userId);
    }
    // start network chat
    const chat: any = await createChat({ 
      participants: [userId],
      is_group: 0 
    });
    startCreatingChat(false)
    // redirect to chat
    userType === 'client'
      ? navigate(`/client/chats/${chat?.id}`)
      : navigate(`/${userType}/chats/${chat?.chat_type}?id=${chat?.id}`);
  }

  const handleEditUpdate = () => {
    refetchPost();
    refetchComments();
  }

  const prevLocation = location.pathname.includes('my-posts') ? 
    [
      { label: "My Posts", url: `/${userType}/forums/my-posts` },
    ]
    :
    [
      { label: "Forum Home", url: `/${userType}/forums/all-posts` },
      {
        label: post?.topic_data?.title,
        url: `/${userType}/forums/topic/${post?.topic}`,
      },
    ];

  return (
    <ForumsLayout tab={location.pathname.includes('my-posts') ? 'My Posts' : 'Home'}>
      <div className="post-page">
        {post && (
          <Breadcrumb
            previous={prevLocation}
            current={post?.title}
          />
        )}
        <div className="post-page__post mt-3">
          {isPostLoading ? (
            <RiseLoader className="my-4" />
          ) : isPostError || !post ? (
            <div>Error: {postError || "Error occured while requesting post's data"}</div>
          ) : (
            <>
              <div className="col-10">
                <div className="d-flex mb-2">
                  <span className="title text-ellipsis">{post?.title}</span>
                  <span className="category">{post?.topic_data?.title}</span>
                  <img
                    className="ml-auto"
                    src={FollowersIcon}
                    alt="followers"
                  />
                  <span className="ml-1 my-auto mr-4 date">
                    {numeral(post?.followers_count).format("0,0")} followers
                  </span>
                </div>

                <div className="d-flex">
                  <User size="normal" avatar={post?.author?.avatar} />
                  <div className="ml-2">
                    <div className="name mt-auto">
                      {getUserName(post?.author)}
                    </div>
                    {post?.modified && (
                      <div className="date mb-auto">
                        {format(
                          new Date(post?.modified),
                          "MMM dd yyyy hh:mm:ss"
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-2 message">{post?.message}</div>
              </div>
              <div className="ml-auto buttons col-2">
                {
                  post?.author?.id === +myId ? 
                  <Button 
                    type="outline"
                    onClick={e => editPostModal.setOpen(true)}
                  >
                    Edit Post
                  </Button>
                  :
                  <>
                    <Button
                      isLoading={isFollowing}
                      type={post?.followed ? "outline" : "normal"}
                      onClick={() => handleFollowPost(post?.followed)}
                    >
                      {post?.followed ? "Unfollow Post" : "Follow Post"}
                    </Button>
                    {!(userType === 'client' && post?.author?.user_type === 'client') && (
                      <Button 
                      type="outline" 
                      className="mt-2" 
                      onClick={e => handleStartChat(post?.author?.id, post?.author?.user_type)}
                      isLoading={isCreatingChat}
                      disabled={isCreatingChat}
                      >
                        Start a Chat
                      </Button>
                    )}
                  </>
                }
              </div>
            </>
          )}
        </div>
        <Folder
          label={comments ? `Replies(${comments.results.length})` : `Replies`}
          className="mt-4 position-relative"
        >
          {post?.last_comment_time && (
            <div className="post-page__jump-to-last">
              <span className="my-auto">
                JUMP TO LAST REPLY -{" "}
                {format(
                  new Date(post?.last_comment_time),
                  "MM/dd/yyyy hh:mm:ss a"
                )}
              </span>
              <IconButton type="down" className="mx-1" onClick={handleJumpToLastReply} />
            </div>
          )}
          <FolderItem>
            {isCommentsLoading ? (
              <RiseLoader className="my-4" />
            ) : isCommentsError ? (
              <div>Error: {commentsError}</div>
            ) : comments && comments.results.length > 0 ? (
              comments.results.map((comment, index) => (
                <span ref={comments.results.length === index + 1 ? lastReplayRef : null} key={index}>
                  <Reply 
                    data={comment}
                  />
                </span>
              ))
            ) : (
              <div className="my-4 text-center text-gray">No replies</div>
            )}
            <Textarea className="mt-3" {...reply} />
            
            <Button
              className="mt-1 ml-auto"
              onClick={handleReply}
              isLoading={isReplying}
            >
              Post Reply
            </Button>
          </FolderItem>
        </Folder>
        {
          editPostModal?.open &&
          <EditPostModal {...editPostModal} post={post} onUpdate={handleEditUpdate} />
        }
        <div className="post-page__reply-container"></div>
      </div>
    </ForumsLayout>
  );
};
