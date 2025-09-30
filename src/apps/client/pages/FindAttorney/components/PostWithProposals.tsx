import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  Button,
  User,
  RiseLoader,
  Folder,
  FolderItem,
} from "components";
import { navigate } from "@reach/router";
import { Link } from "@reach/router";
import { createChat, acceptProposal, revokeProposal, createOpportunity } from "api";
import { RepPostMatterModal, ConfirmProposalModal, RevokeProposalModal, DeletePostedMatterModal, ReactivatePostedMatterModal } from "modals";
import { useModal } from "hooks";
import { format } from "date-fns";
import { useAuthContext, useChatContext } from "contexts";
import { renderBudget, renderProposalRate } from "helpers";

interface Props {
  list: any[] | undefined;
  postId: number;
  isTopicsLoading?: boolean;
  topics: {
    id: number;
    title: string;
  }[],
  refetchPosts
}
export const PostWithProposals = (props: Props) => {
  const { profile } = useAuthContext();
  //const { sendProposalMessage } = useChatContext();
  const editPost = useModal();
  const confirmAcceptModal = useModal();
  const confirmRevokeModal = useModal();
  const deleteModal = useModal();
  const activateModal = useModal();
  const [isCreatingChat, startCreatingChat] = useState(false);
  const [post, setPost] = useState<any>({})
  const [proposalId, setProposalId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleChat = async (clientId: number, skipRedirect?: boolean) => {
    setIsLoading(true)
    // get direct chat 
    const chat = await createChat({
      participants: [clientId, +profile.id],
      is_group: 0
    })
    setIsLoading(false)
    if (skipRedirect)
      return chat;
    // redirect to chat 
    navigate(`/client/chats/${chat.id}`);
  };

  useEffect(() => {
    if (!props.list?.length) return;
    const currentPost = props.list.find(p => p.id === props.postId);
    if (currentPost)
      setPost(currentPost);
  }, [props.list, props.postId])

  const handleAcceptProposal = async (pid: number) => {
    setIsLoading(true)
    await acceptProposal(pid);
    // find proposal
    const currentProposal = post.proposals.find(p => p.id === pid);
    handleChat(currentProposal?.attorney_data?.id, false);
    // get firebase channel id
    //const { id, chat_channel } = await handleChat(currentProposal?.attorney_data?.id, true);
    //setIsLoading(false);
    //if (chat_channel)
    //  sendProposalMessage(chat_channel, {
    //    postId: post.id,
    //    postTitle: post.title,
    //    practiceArea: post?.practice_area_data?.title,
    //    attorney: currentProposal?.attorney_data,
    //  })
    //// 
    //const message = `${profile?.first_name} ${profile?.last_name} has accepted ${currentProposal?.attorney_data?.first_name} ${currentProposal?.attorney_data?.last_name}'s proposal for ${post?.title} ${post?.practice_area_data?.title} at $${currentProposal?.rate}${currentProposal?.rate_type==='hourly' ? '/hr' : ' '+currentProposal?.rate_type}! Start your discussion and create a new matter`;
    //console.log('message', message);
  }

  const handleRevokeProposal = async (id: number) => {
    setIsLoading(true)
    await revokeProposal(id);
    setIsLoading(false)
    props.refetchPosts();
  }

  const handleOpenProfile = (e, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/client/find/posts/${post?.id}/attorneys/${id}`)
  }

  const proposals = !isLoading && post?.proposals?.length && post.proposals.sort(
    (p1, p2) => {
      const a = p1.status === 'accepted';
      const b = p2.status === 'accepted';
      return (a === b) ? 0 : a ? -1 : 1;
    });

  const acceptedId = proposals?.length && proposals[0]?.status === 'accepted' ? proposals[0].id : null;

  return (
    <div className="post-proposals w-100">
      <div className="forums-page__topic submitted-engagement-page">
        {isLoading
          ? (
            <div className="post-page__post mt-3">
              <RiseLoader className="my-4" />
            </div>
          )
          : !Object.keys(post).length
            ? (
              <div className="post-page__post mt-3">
                Post not found
              </div>
            )
            : (
              <>
                <Breadcrumb
                  previous={[
                    {
                      label: "Representation",
                      url: "/client/find",
                    },
                  ]}
                  current={post?.title}
                  className="mb-3"
                />

                <div className="post-page__post mt-3">
                  <div className="w-100 justify-content-between">
                    <div className={post?.status === 'inactive' ? "inactive-post" : ""}>
                      <div className="d-flex title-holder">
                        <span className="title mr-2">{post?.status === 'inactive' ? '(Inactive) ' : ''}{post?.title}</span>
                        <span className="tag-control tag-control--custom">
                          {post?.practice_area_data?.title}
                        </span>
                      </div>
                      <div className="date mb-auto posted-date">
                        {post?.created
                          ? 'Posted ' + format(new Date(post?.created), "MM/dd/yy")
                          : ""}
                      </div>
                      <div className="mb-1 capitalize posted-budget">
                        <b className="mr-05">Budget:</b>
                        {renderBudget(post)}
                      </div>
                      <div className="text-dark posted-description pre-wrap">
                        {post?.description}
                      </div>
                    </div>
                    <div className="post-status-block">
                      {acceptedId && post?.proposals.length ? (
                        <>
                          <div className="green-label-text px-2">
                            {`Proposal Accepted on ${format(new Date(post?.proposals[0].status_modified), "MM/dd/yy")}`}
                          </div>
                          <Button
                            width={160}
                            onClick={e => deleteModal.setOpen(true)}
                            className="mt-2"
                            theme="white"
                          >
                            Delete Post
                          </Button>
                        </>
                      ) : post?.status === 'inactive' ? (
                        <>
                          <Button
                            width={160}
                            onClick={e => activateModal.setOpen(true)}
                            className="mt-2"
                            type="outline"
                          >
                            Reactivate
                          </Button>
                          <Button
                            width={160}
                            onClick={e => deleteModal.setOpen(true)}
                            className="mt-2"
                            theme="white"
                          >
                            Delete Post
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            width={160}
                            type="outline"
                            onClick={e => editPost.setOpen(true)}
                            className="mt-2"
                          >
                            Edit Post
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {!!proposals?.length && (
                  <Folder className="mt-4" label="Proposals">
                    {proposals.map((proposal, i) => (
                      <FolderItem
                        key={`${proposal.id}-${i}`}
                        className={acceptedId && proposal.id !== acceptedId ? 'faded-proposal' : ''}
                      >
                        <div className="w-100">
                          <div className="justify-content-between">
                            <Link className="profile-link" to={`/client/find/attorneys/${proposal?.attorney_data?.id}`}>
                              <div className="d-flex">
                                <User
                                  className="cursor-pointer"
                                  size="normal"
                                  avatar={proposal?.attorney_data?.avatar}
                                />
                                <div className="ml-2">
                                  <div className="name mt-auto name">{proposal?.attorney_data?.first_name} {proposal?.attorney_data?.last_name}</div>
                                  <div className="date mb-auto">
                                    {proposal?.created
                                      ? 'Submitted ' + format(new Date(proposal.created), "MM/dd/yy")
                                      : ""}
                                  </div>
                                </div>
                              </div>
                            </Link>
                            <div className="d-flex">
                              <div className="submitted-rate mr-3">{renderProposalRate(proposal)}</div>
                              <div>
                                {proposal?.status !== 'pending' ? (
                                  <RespondedProposalControl
                                    proposal={proposal}
                                    onRevoke={id => {
                                      setProposalId(id)
                                      confirmRevokeModal.setOpen(true)
                                    }}
                                    onGotoChat={() => handleChat(proposal?.attorney_data?.id)}
                                  />
                                ) : (
                                  <>
                                    <div>
                                      <Button theme="green" widthFluid onClick={e => {
                                        setProposalId(proposal.id)
                                        confirmAcceptModal.setOpen(true)
                                      }}>
                                        Accept
                                      </Button>
                                    </div>
                                    <div className="mt-2">
                                      <Button widthFluid theme="white" onClick={e => handleChat(proposal?.attorney_data?.id)}>
                                        Start Chat
                                      </Button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-dark mt-2 proposal-description">{proposal?.description}</div>
                        </div>
                      </FolderItem>
                    ))}
                  </Folder>
                )}
              </>
            )}
      </div>
      {!!post.id && (
        <>
          {
            confirmAcceptModal?.open &&
            <ConfirmProposalModal
              {...confirmAcceptModal}
              proposalId={proposalId}
              onAccept={handleAcceptProposal}
            />
          }
          {
            confirmRevokeModal?.open &&
            <RevokeProposalModal
              {...confirmRevokeModal}
              proposalId={proposalId}
              onConfirm={handleRevokeProposal}
            />
          }
          <RepPostMatterModal
            {...editPost}
            isTopicsLoading={props.isTopicsLoading}
            topics={props.topics}
            data={post}
            refetchPosts={props.refetchPosts}
          />
          {
            deleteModal?.open &&
            <DeletePostedMatterModal
              {...deleteModal}
              onDelete={() => navigate("/client/find")}
              id={post.id}
            />
          }
          {
            activateModal?.open &&
            <ReactivatePostedMatterModal
              {...activateModal}
              callback={props.refetchPosts}
              id={post.id}
            />
          }
        </>
      )}
    </div>
  );
};


const RespondedProposalControl = ({ proposal: { id, status, status_modified }, onRevoke, onGotoChat }) => {
  switch (status) {
    case 'accepted':
      return (
        <>
          <div>
            <Button widthFluid theme="green" onClick={e => onGotoChat(id)} className="mt-1">
              Go to Chat
            </Button>
          </div>
          <div>
            <Button widthFluid theme="white" onClick={e => onRevoke(id)} className="mt-1">
              Revoke
            </Button>
          </div>
          <div className="proposal-status mt-1">You accepted this proposal</div>
        </>
      );
    default:
      return (
        <>
          <div className="proposal-status">
            <div>{status}</div>
            <div>on {format(new Date(status_modified), "MM/dd/yy")}</div>
          </div>
          <div>
            <Button widthFluid theme="green" onClick={e => onGotoChat(id)} className="mt-1">
              Go to Chat
            </Button>
          </div>
        </>
      )
  }
}