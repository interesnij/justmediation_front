import React, { useState } from "react";
import {
  Post,
  Select,
  Folder,
  FolderItem,
  Button,
  RiseLoader,
  Pagination,
} from "components";
import { useAuthContext } from "contexts";
import { useInput } from "hooks";
import { RouteComponentProps } from "@reach/router";
import { ForumsLayout } from "layouts";
import { getFollowedTopics, getFollowedPosts, unfollowTopic } from "api";
import { useQuery } from "react-query";
import { Link } from "@reach/router";
import numeral from "numeral";
import { filterData, sortData } from "./ParamsConstants";
import "./style.scss";

export const FollowingPage: React.FunctionComponent<RouteComponentProps> =
  () => {
    const filterBy = useInput(filterData[0].id);
    const sortBy = useInput(sortData[0].id);
    const postPage = useInput(0);

    const {
      isLoading: isTopicsLoading,
      isError: isTopicsError,
      error: topicsError,
      data: topicsData,
      refetch: refetchTopics,
    } = useQuery<any[], Error>(["followedTopics"], () => getFollowedTopics(), {
      keepPreviousData: true,
    });

    const {
      isLoading: isPostsLoading,
      isError: isPostsError,
      error: postsError,
      data: postsData,
      refetch: refetchPosts,
    } = useQuery<{ results: any[]; count: number }, Error>(
      ["topic-posts", postPage.value, sortBy.value, filterBy.value],
      () => getFollowedPosts({ 
        page: postPage.value, 
        ordering: sortBy.value,
      ...(filterBy.value && { [filterBy.value]: 0 })
      }),
      {
        keepPreviousData: true,
      }
    );

    return (
      <ForumsLayout tab="Following" onCreatePost={() => refetchPosts()}>
        <div className="forums-page__following">
          <Folder label="Topics & Practice Areas You Follow">
            {isTopicsLoading ? (
              <FolderItem>
                <RiseLoader className="my-4" />
              </FolderItem>
            ) : isTopicsError ? (
              <div className="my-2 text-center">{topicsError}</div>
            ) : topicsData && topicsData.length > 0 ? (
              <div className="d-flex flex-wrap">
                {topicsData.map((topic: any, index: number) => {
                  return (
                    <Topic
                      topic={topic}
                      onUpdate={() => refetchTopics()}
                      key={`${index}key`}
                    />
                  );
                })}
              </div>
            ) : (
              <FolderItem>
                <div className="my-2 text-center text-gray">
                  Topics & Practice Areas You Follow will appear here.
                </div>
              </FolderItem>
            )}
          </Folder>
          <Folder label="Posts You Follow" className="mt-4">
            <div className="folder__filter d-flex pr-4">
              <Select data={filterData} {...filterBy} label="Filter by" />
              <Select
                data={sortData}
                {...sortBy}
                label="Sort by"
                className="ml-3 mr-3"
                width={180}
              />
            </div>
            {isPostsLoading ? (
              <FolderItem>
                <RiseLoader className="my-4" />
              </FolderItem>
            ) : isPostsError ? (
              <FolderItem>
                <div className="my-3 text-center text-gray">{postsError}</div>
              </FolderItem>
            ) : postsData?.results.length === 0 ? (
              <FolderItem>
                <div className="my-3 text-center text-gray">
                  Posts you follow will be here
                </div>
              </FolderItem>
            ) : (
              postsData?.results.map((post, index) => {
                return (
                  <FolderItem key={`${index}key`}>
                    <Post {...post} />
                  </FolderItem>
                );
              })
            )}
            <div className="mt-3 pb-4">
              <Pagination tatalCount={postsData?.count} {...postPage} />
            </div>
          </Folder>
        </div>
      </ForumsLayout>
    );
  };

const Topic = ({ topic, onUpdate = () => {} }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { userType } = useAuthContext();

  const handleUnfollow = async () => {
    setIsLoading(true);
    await unfollowTopic(topic?.id);
    setIsLoading(false);
    onUpdate();
  };

  return (
    <div className="forums-page__following-topic-item">
      <Link to={`/${userType}/forums/topic/${topic?.id}`} className="topic">
        <div className="title">{topic?.title}</div>
        <div className="value">
          {numeral(topic?.post_count).format("0,0")} posts
        </div>
      </Link>
      <Button
        className="ml-auto my-auto"
        isLoading={isLoading}
        onClick={handleUnfollow}
        type="outline"
      >
        Unfollow
      </Button>
    </div>
  );
};
