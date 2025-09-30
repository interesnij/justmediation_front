import React, { useEffect, useState } from "react";
import { Folder, FolderItem, RiseLoader } from "components";
import { RouteComponentProps, useParams, navigate } from "@reach/router";
import { AttorneyFindLayout } from "apps/client/layouts";
import { MatterRepresentation, Post, PostWithProposals } from "./components";
import { useQuery } from "react-query";
import { useInput, useModal } from "hooks";
import { getClientPostedMatters, getPostedMatterTopics } from "api";
import { useAuthContext } from "contexts";
import { DeletePostedMatterModal, ReactivatePostedMatterModal } from "modals";

export const RepresentationPage: React.FunctionComponent<RouteComponentProps> =
() => {
  const page = useInput(0);
  const { userId } = useAuthContext();
  const params = useParams();
  const [topics, setTopics] = useState<any[]>([]);
  const [fullList, setFullList] = useState<any[]>([]);
  const deleteModal = useModal();
  const activateModal = useModal();
  const [postId, setPostId] = useState(0);

  const {
    data: activePosts,
    isFetching: isActivesLoading,
    refetch: refetchActivePosts
  } = useQuery<{ results: any[]; count: number }, Error>(
    ["my-active-posted-matters"],
    () =>
      getClientPostedMatters(+userId, {
        isActive: true,
        ordering: "-status_modified"
      }),
    {
      keepPreviousData: true,
    }
  );

  const {
    data: inactivePosts,
    isFetching: isInactivesLoading,
    refetch: refetchInactivePosts
  } = useQuery<{ results: any[]; count: number }, Error>(
    ["my-inactive-posted-matters"],
    () =>
      getClientPostedMatters(+userId, {
        isActive: false,
        ordering: "-status_modified"
      }),
    {
      keepPreviousData: true,
    }
  );

  const {
    isLoading: isTopicsLoading,
    data: topicsData,
  } = useQuery<{ results: any[]; count: number }, Error>(
    ["posted-matter-topics"],
    () =>
      getPostedMatterTopics(),
    { keepPreviousData: true }
  );

  useEffect(() => {
    if (!topicsData?.results?.length) return;
    setTopics(
      topicsData.results.map(t => {
        return {
          id: t.id,
          title: t.title
        }
      })
    )
  }, [topicsData]);

  useEffect(() => {
    if (activePosts?.results && inactivePosts?.results)
      setFullList([
        ...activePosts.results,
        ...inactivePosts.results
      ])
  }, [activePosts?.results, inactivePosts?.results])

  const refetchPosts = () => {
    refetchActivePosts();
    refetchInactivePosts();
  }

  const handleDeletePost = (e, id: number) => {
    e.stopPropagation();
    e.preventDefault();
    setPostId(id);
    deleteModal.setOpen(true);
  }

  const handleReactivate = (e, id: number) => {
    e.stopPropagation();
    e.preventDefault();
    setPostId(id);
    activateModal.setOpen(true);
  }

  return (
    <AttorneyFindLayout tab="Representation">
      {isActivesLoading || isInactivesLoading ? (
        <div className="representation-page align-items-center justify-content-center">
          <div className="post-page__post mt-3">
            <RiseLoader className="my-4" />
          </div>
        </div>
      ) : params.id
        ? <PostWithProposals 
            list={fullList}
            postId={+params.id}
            topics={topics}
            isTopicsLoading={isTopicsLoading}
            refetchPosts={refetchPosts}
          />
        : <div className="representation-page">
            <MatterRepresentation 
              topics={topics}
              isTopicsLoading={isTopicsLoading}
              refetchPosts={refetchPosts}
            />
            {!!activePosts?.results?.length && (
              <Folder label="Posts" className="mt-4">
                {activePosts.results.map((post, index) => (
                  <FolderItem key={`${index}key`}>
                    <Post post={post} />
                  </FolderItem>
                ))}
              </Folder>
            )} 
            {!!inactivePosts?.results?.length && (
              <Folder label="Inactive Posts" className="mt-4 inactive-folder">
                {inactivePosts.results.map((post, index) => (
                  <FolderItem key={`${index}key`}>
                    <Post post={post} onDeletePost={handleDeletePost} onReactivate={handleReactivate} />
                  </FolderItem>
                ))}
              </Folder>
            )} 
          </div>
      }
      {deleteModal?.open &&
        <DeletePostedMatterModal {...deleteModal} onDelete={refetchPosts} id={postId} />
      }
      {activateModal?.open && 
        <ReactivatePostedMatterModal {...activateModal} callback={refetchPosts} id={postId} />
      } 
    </AttorneyFindLayout>
  );
};
