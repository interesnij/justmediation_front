import React, { useState, useEffect } from "react";
import {
  Breadcrumb,
  Button,
  User,
  RiseLoader,
  Folder,
  FolderItem,
} from "components";
import { RouteComponentProps, useParams, navigate } from "@reach/router";
import { getPostedMatterById, getProposalById, createChat, createOpportunity } from "api";
import { useModal } from "hooks";
import { AttorneyLayout, EngagementLayout } from "apps/attorney/layouts";
import { Proposal, WithdrawProposal, DeleteProposal } from "modals";
import { useQuery } from "react-query";
import { format } from "date-fns";
import { useAuthContext } from "contexts";
import { renderBudget, renderProposalRate } from "helpers"; 

export const EngagementSubmittedPostPage: React.FunctionComponent<RouteComponentProps> =
  () => {
    const { profile, userType, userId } = useAuthContext();
    const submitModal = useModal();
    const withdrawModal = useModal();
    const deleteModal = useModal();
    const params = useParams();
    const [isShowFullDescription, setShowFullDescription] = useState(false);
    const [proposalId, setProposalId] = useState(0);
    const [isCreatingChat, startCreatingChat] = useState(false);

    // fetch posted matter 
    const { 
      refetch: postRefetch, 
      isFetching: isPostLoading, 
      isError: isPostError, 
      error: postError, 
      data: postData 
    } = useQuery<any, Error>(
      ["submitted-post-id"],
      () => getPostedMatterById(params.id, userId),
      {
        keepPreviousData: true, 
        enabled: !!params.id 
      }
    );

    //// fetch proposal
    const { 
      refetch: proposalRefetch, 
      isFetching: isProposalLoading, 
      isError: isProposalError, 
      error: proposalError, 
      data: proposalData 
    } = useQuery<any, Error>(
      ["proposal-id"],
      () => getProposalById(proposalId),
      { 
        keepPreviousData: false,
        enabled: !!proposalId
      }
    );

    useEffect(() => {
      if (isPostLoading) return;
      postRefetch()
    }, [params.id])

    useEffect(() => {
      if (
        !postData?.proposals?.length ||
        proposalId === postData.proposals[0]?.id
      ) return;
      setProposalId(postData.proposals[0].id);
    }, [postData?.proposals]);

    useEffect(() => {
      if (isProposalLoading || !proposalId) return;
      proposalRefetch()
    }, [proposalId])

    const handleChat = async (clientId: number) => {
        startCreatingChat(true)
        // create direct chat
        const chat = await createChat({
          participants: [clientId],
          is_group: 0
        });
        const client = chat?.participants_data?.find(person => person.user_type === 'client');
        if (client?.lead_id) {
          navigate(`/${userType}/chats/leads?id=${chat?.id}`);
          return;
        }
        if (!client?.opportunity_id) {
          await createOpportunity({
            client: clientId,
            attorney: profile.id
          })
        }
        startCreatingChat(false)  
        // redirect to chat page
        navigate(`/${userType}/chats/opportunities?id=${chat?.id}`);
      };

    const isLongDescription = !!(postData?.description && postData?.description.length > 220);

    return (
      <AttorneyLayout title="Potential Engagement" showButtons={false} userType={userType}>
        <EngagementLayout tab="Submitted Engagements" userType={userType}>
          <div className="forums-page__topic submitted-engagement-page">
            {isPostLoading ? (
              <div className="post-page__post mt-3">
                <RiseLoader className="my-4" />
              </div>
            ) : isPostError ? (
              <div className="post-page__post mt-3">
                <div className="my-4 text-center text-gray">{postError}</div>
              </div>
            ) : (
              <>
                <Breadcrumb
                  previous={[
                    {
                      label: "Submitted Engagements",
                      url: `/${userType}/engagement/submitted`,
                    },
                  ]}
                  current={postData?.title}
                  className="mb-3"
                />

                <div className="post-page__post mt-3">
                  <div className="w-100 posted-matter">
                    <div className="d-flex mb-2">
                      <span className="title">{postData?.title}</span>
                      {postData?.practice_area_data && 
                        <span className="category">{postData.practice_area_data?.title}</span>
                      }
                    </div>

                    <div className="d-flex">
                      <User size="normal" avatar={postData?.client_data?.avatar} />
                      <div className="ml-2">
                        <div className="name mt-auto">{postData?.client_data?.first_name} {postData?.client_data?.last_name}</div>
                        <div className="date mb-auto">
                          {postData?.created
                            ? 'Posted ' + format(new Date(postData.created), "MM/dd/yy")
                            : ""}
                        </div>
                      </div>
                    </div>
                    <div className="my-3 d-flex font-size-md capitalize">
                      <span className="mr-05">Budget:</span>
                      {renderBudget(postData)}
                    </div>
                    <div className={`text-dark post-description${isLongDescription && !isShowFullDescription ? ' faded-text' : ''}`}>
                      {postData?.description}
                    </div>
                    {isLongDescription && !isShowFullDescription && (
                      <div className="view-more mt-1" onClick={e=>setShowFullDescription(true)}>
                        View More
                      </div>
                    )}
                  </div>
                  {postData?.client_data?.id && (	
                    <div className="ml-auto" style={{ minWidth: 180 }}>	
                      <Button 	
                       widthFluid 	
                       type="outline" 	
                       onClick={e => handleChat(postData.client_data.id)} 	
                       className="mt-2"	
                       isLoading={isCreatingChat}	
                       disabled={isCreatingChat}	
                      >	
                        Start a Chat	
                      </Button>	
                    </div>	
                  )}
                </div>
              
                <Folder className="mt-4" label="Your Proposal">
                  {isProposalLoading ? (
                    <FolderItem>
                      <RiseLoader className="my-4" />
                    </FolderItem>
                  ) : isProposalError ? (
                    <FolderItem>
                      <div className="text-center my-4 text-gray">
                        {proposalError}
                      </div>
                    </FolderItem>
                  ) : (
                    <FolderItem>
                      <div className="w-100">
                        <div className="justify-content-between">
                          <div>
                          <div className="d-flex">
                            <User size="normal" avatar={proposalData?.attorney_data?.avatar} />
                            <div className="ml-2">
                              <div className="name mt-auto">{proposalData?.attorney_data?.first_name} {proposalData?.attorney_data?.last_name}</div>
                              <div className="date mb-auto">
                                {proposalData?.created
                                  ? 'Submitted ' + format(new Date(proposalData.created), "MM/dd/yy")
                                  : ""}
                              </div>
                            </div>
                          </div>
                          <div className="text-dark mt-2 proposal-description">{proposalData?.description}</div>
                          </div>

                          <div className="d-flex">
                            <div className="submitted-rate mr-3">
                              {renderProposalRate(proposalData)}
                            </div>
                            <ProposalControl 
                              proposal={proposalData}
                              postData={postData}
                              onEdit={()=>submitModal.setOpen(true)}
                              onDelete={()=>deleteModal.setOpen(true)}
                              onWithdraw={()=>withdrawModal.setOpen(true)}
                            />
                          </div>
                        </div>
                      </div>
                    </FolderItem>
                  )}
                </Folder>
              </>
            )}
          </div>
        </EngagementLayout>
        {submitModal?.open && !isProposalLoading && proposalData?.id &&
          <Proposal {...submitModal} post={postData} proposal={proposalData} onCreate={() => proposalRefetch()} />
        }
        {
          withdrawModal?.open &&
          <WithdrawProposal {...withdrawModal} proposal={proposalData} userType={userType} />
        }
        {
          deleteModal?.open &&
          <DeleteProposal 
            {...deleteModal} 
            proposal={proposalData} 
            callback={() => navigate(`/${userType}/engagement/submitted`)}  
          />
        }
      </AttorneyLayout>
    );
  };

  const ProposalControl = ({ proposal, postData, onEdit, onDelete, onWithdraw }) => (
    <div>
      {proposal?.status === 'pending' && postData?.status === 'active'
        ? <>
            <div>
              <Button widthFluid onClick={onEdit}>
                Edit Proposal
              </Button>
            </div>
            <div className="mt-2">
              <Button widthFluid theme="white" onClick={e => onWithdraw(proposal?.id)}>
                Delete
              </Button>
            </div>
          </>
        : <>
            {!!proposal?.status_modified && (
              <div className="proposal-status">
                {`Proposal Accepted on ${format(new Date(proposal.status_modified), "MM/dd/yy")}`}
              </div>
            )}
            <div>
              <Button widthFluid theme="white" onClick={e => onWithdraw(proposal?.id)} className="mt-1">
                Delete
              </Button>
            </div>
          </>
      }
    </div>
  )
