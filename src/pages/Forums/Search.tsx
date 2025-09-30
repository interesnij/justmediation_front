import React, { useEffect } from "react";
import { RouteComponentProps, useLocation } from "@reach/router";
import {
  Post,
  Select,
  Topic,
  Pagination,
  Folder,
  FolderItem,
  Breadcrumb,
} from "components";
import { useQuery } from "react-query";
import { ForumsLayout } from "layouts";
import { useInput } from "hooks";
import { css } from "@emotion/react";
import RiseLoader from "react-spinners/RiseLoader";
import { getForumTopics, getPosts } from "api";
import { useAuthContext } from "contexts";
import { parse } from "query-string";

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
    id: "post_count",
  },
];
const filterData = [
  {
    title: "All",
    id: "All",
  },
  { title: "No Replies", id: "noReplies" },
];
const sortData = [
  {
    title: "Most Recent",
    id: "mostRecent",
  },
  {
    title: "Replies (most to least)",
    id: "toLeast",
  },
  {
    title: "Replies (least to most)",
    id: "toMost",
  },
  {
    title: "Most Followers",
    id: "mostFollowers",
  },
];
export const SearchPage: React.FunctionComponent<RouteComponentProps> = () => {
  const page = useInput(0);
  const postPage = useInput(0);
  const topcSortBy = useInput(sortTopic[0].id);
  const filterBy = useInput(filterData[0].id);
  const sortBy = useInput(sortData[0].id);
  const { userType } = useAuthContext();
  const location = useLocation();
  const { query } = parse(location.search);

  const {
    isLoading: isTopicsLoading,
    isError: isTopicsError,
    error: topicsError,
    data: topicsData,
  } = useQuery<{ results: any[]; count: number }, Error>(
    ["search-topics", page, topcSortBy.value, query],
    () =>
      getForumTopics({
        page: page.value,
        search: query as string,
        sort: topcSortBy.value,
      }),
    {
      keepPreviousData: true,
    }
  );

  const {
    isLoading: isPostsLoading,
    isError: isPostsError,
    error: postsError,
    data: postsData,
  } = useQuery<{ results: any[]; count: number }, Error>(
    ["search-posts", postPage.value, query],
    () => getPosts({ page: postPage.value, search: query as string }),
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
    <ForumsLayout tab="Home">
      <div className="forums-page__all-posts">
        {isTopicsLoading || isPostsLoading ? (
          <div className="my-4 d-flex">
            <RiseLoader
              size={15}
              margin={2}
              color="rgba(0,0,0,.6)"
              css={css`
                display: block;
                margin: 200px auto;
              `}
            />
          </div>
        ) : isTopicsError ? (
          <div>Error: {topicsError?.message}</div>
        ) : isPostsError ? (
          <div>Error: {postsError?.message}</div>
        ) : (
          <>
            <Breadcrumb
              previous={[
                { label: "Forum Home", url: `/${userType}/forums/all-posts` },
              ]}
              current={`Search Results for "${query ?? ""}"`}
            />
            <Folder label="Topics & Practice Areas" className="mt-4">
              <div className="folder__filter">
                <Select
                  label="Sort by"
                  className="ml-auto"
                  data={sortTopic}
                  {...topcSortBy}
                  backgroundColor="white"
                  width={140}
                  alignRight
                />
              </div>
              {topicsData?.results.length === 0 ? (
                <FolderItem>
                  <div className="my-3 text-center text-gray">No topics</div>
                </FolderItem>
              ) : (
                topicsData?.results.map((topic, index) => {
                  return (
                    <FolderItem key={`${index}key`}>
                      <Topic data={topic} />
                    </FolderItem>
                  );
                })
              )}
            </Folder>
            <div className="mt-3 pb-4">
              <Pagination tatalCount={topicsData?.count} {...page} />
            </div>
            <Folder label="Posts by me">
              <div className="folder__filter d-flex">
                <Select data={filterData} {...filterBy} label="Filter by" />
                <Select
                  data={sortData}
                  {...sortBy}
                  label="Sort by"
                  className="ml-3"
                  width={190}
                  alignRight
                />
              </div>
              {postsData?.results.length === 0 ? (
                <FolderItem>
                  <div className="my-3 text-center text-gray">No posts</div>
                </FolderItem>
              ) : (
                postsData?.results.map((post: any, index: number) => {
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
          </>
        )}
      </div>
    </ForumsLayout>
  );
};
