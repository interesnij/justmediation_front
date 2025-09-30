import React, { useState } from "react";
import {
  Post,
  Select,
  Breadcrumb,
  Button,
  Folder,
  FolderItem,
  RiseLoader,
  Pagination,
} from "components";
import { useInput } from "hooks";
import { RouteComponentProps, useParams } from "@reach/router";
import { ForumsLayout } from "layouts";
import { useAuthContext } from "contexts";
import { useQuery } from "react-query";
import { getTopicById, followTopic, unfollowTopic, getPosts } from "api";
import { filterData, sortData } from "./ParamsConstants";
import numeral from "numeral";
import "./style.scss";

export const TopicPage: React.FunctionComponent<RouteComponentProps> = () => {
  const filterBy = useInput(filterData[0].id);
  const sortBy = useInput(sortData[0].id);
  const params = useParams();
  const { userType } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const postPage = useInput(0);

  const {
    isLoading: isTopicLoading,
    isError: isTopicError,
    error: topicError,
    data: topic,
    refetch: refetchTopic,
  } = useQuery<any, Error>(
    ["topic", params.id],
    () => getTopicById(params.id),
    {
      keepPreviousData: true,
    }
  );

  const {
    isLoading: isPostsLoading,
    isError: isPostsError,
    error: postsError,
    data: postsData,
    refetch: refetchPosts,
  } = useQuery<{ results: any[]; count: number }, Error>(
    ["topic-posts", postPage.value, sortBy.value, filterBy.value],
    () => getPosts({ 
      page: postPage.value, 
      topic: params.id, 
      ordering: sortBy.value,
      ...(filterBy.value && { [filterBy.value]: 0 })
      
    }),
    {
      keepPreviousData: true,
    }
  );

  const handleUnfollow = async () => {
    setIsLoading(true);
    if (topic?.followed) {
      await unfollowTopic(topic?.id);
    } else {
      await followTopic(topic?.id);
    }
    setIsLoading(false);
    refetchTopic();
  };
  
  return (
    <ForumsLayout tab="Home" onCreatePost={() => refetchPosts()}>
      <div className="forums-page__topic">
        <Breadcrumb
          previous={[
            { label: "Forum Home", url: `/${userType}/forums/all-posts` },
          ]}
          current={topic?.title}
          className="mb-3"
        />
        <div className="forums-page__topic-heading">
          {isTopicLoading ? (
            <RiseLoader className="my-4" />
          ) : isTopicError ? (
            <div>Error: {topicError?.message}</div>
          ) : (
            <>
              <div className="forums-page__topic-heading-main">
                <div className="title">{topic?.title}</div>
                <div className="desc mt-1">{topic?.description}</div>
              </div>
              <div className="forums-page__topic-heading-posts flex-column ml-auto my-auto">
                <div>{numeral(topic?.post_count).format("0,0")}</div>
                <div className="desc text-center mt-0">Posts</div>
              </div>
              <div className="forums-page__topic-heading-action flex-column my-auto">
                <Button
                  type={topic?.followed ? "outline" : "normal"}
                  onClick={handleUnfollow}
                  isLoading={isLoading}
                >
                  {topic?.followed ? "Unfollow" : "Follow"}
                </Button>
                <span className="forums-page__topic-heading-followers">
                  {topic?.followers_count}&nbsp; Followers
                </span>
              </div>
            </>
          )}
        </div>
        <Folder label="Posts" className="mt-4">
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
                You will have posts here
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
          <div className="folder__filter d-flex pr-4">
            <Select data={filterData} label="Filter by" {...filterBy} />
            <Select
              data={sortData}
              className="ml-3 mr-1"
              label="Sort by"
              {...sortBy}
              width={180}
            />
          </div>
        </Folder>
      </div>
    </ForumsLayout>
  );
};
