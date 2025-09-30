import React, { useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import {
  RecentPost,
  Select,
  Topic,
  Pagination,
  Folder,
  FolderItem,
  RiseLoader,
} from "components";
import { useQuery } from "react-query";
import { ForumsLayout } from "layouts";
import { useInput } from "hooks";
import { getRecentPosts, getForumTopics } from "api";
import { FORUM_TOPICS_PER_PAGE } from "config";
import "./style.scss";

const sortTopic = [
  {
    title: "Alphabetical",
    id: "title",
  },
  {
    title: "Most Recent",
    id: "created",
  },
  {
    title: "Popular",
    id: "-post_count",
  }
];

export const AllPostsPage: React.FunctionComponent<RouteComponentProps> =
  () => {
    const page = useInput(0);
    const topcSortBy = useInput(sortTopic[0].id);
    const {
      isLoading: isRecentPostsLoading,
      isError: isRecentPostsError,
      error: recentPostsError,
      data: recentPosts,
      refetch: refetchRecentPosts,
    } = useQuery<any[], Error>(["recentPosts"], () => getRecentPosts(), {
      keepPreviousData: true,
    });

    const {
      isLoading: isTopicsLoading,
      isError: isTopicsError,
      error: topicsError,
      data: topicsData,
      refetch: refetchTopics,
    } = useQuery<{ results: any[]; count: number }, Error>(
      ["topics", page, topcSortBy.value],
      () => getForumTopics({ 
        page: page.value, 
        sort: topcSortBy.value,
        pageSize: FORUM_TOPICS_PER_PAGE
      }),
      {
        keepPreviousData: true,
      }
    );

    useEffect(() => {
      page.onChange(0);
      return () => {};
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [topcSortBy.value]);

    return (
      <ForumsLayout tab="Home" onCreatePost={() => refetchRecentPosts()}>
        <div className="forums-page__all-posts">
          <Folder label="Recent Posts">
            {isRecentPostsLoading ? (
              <FolderItem>
                <RiseLoader className="my-4" />
              </FolderItem>
            ) : isRecentPostsError ? (
              <div className="my-2 text-center">{recentPostsError}</div>
            ) : recentPosts && recentPosts.length > 0 ? (
              <div className="d-flex">
                {recentPosts &&
                  recentPosts.slice(0, 3).reverse().map((post, index) => {
                    return <RecentPost {...post} key={`${index}key`} />;
                  })}
              </div>
            ) : (
              <FolderItem>
                <div className="my-2 text-center text-gray">
                  Recent Posts will appear here.
                </div>
              </FolderItem>
            )}
          </Folder>
          <Folder label="Topics & Practice Areas" className="mt-4">
            <div className="folder__filter">
              <Select
                label="Sort by"
                className="ml-auto"
                data={sortTopic}
                {...topcSortBy}
                backgroundColor="white"
                width={120}
                alignRight
              />
            </div>
            {isTopicsLoading ? (
              <FolderItem>
                <RiseLoader className="my-4" />
              </FolderItem>
            ) : isTopicsError ? (
              <div className="my-2 text-center">{topicsError}</div>
            ) : topicsData && topicsData.results.length === 0 ? (
              <FolderItem>
                <div className="my-2 text-center text-gray">
                  Topics & Practice Areas will appear here.
                </div>
              </FolderItem>
            ) : (
              topicsData &&
              topicsData.results.map((topic, index) => {
                return (
                  <FolderItem key={`${index}key`}>
                    <Topic data={topic} onRefresh={() => refetchTopics()} />
                  </FolderItem>
                );
              })
            )}
          </Folder>
          {!isTopicsLoading && !isTopicsError && (
            <div className="mt-3 pb-4">
              <Pagination 
                countPerPage={FORUM_TOPICS_PER_PAGE}
                tatalCount={topicsData?.count} 
                {...page} 
              />
            </div>
          )}
        </div>
      </ForumsLayout>
    );
  };
