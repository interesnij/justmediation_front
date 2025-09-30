import React from "react";
import { Post, Select, Folder, FolderItem, RiseLoader } from "components";
import { useInput } from "hooks";
import { RouteComponentProps } from "@reach/router";
import { ForumsLayout } from "layouts";
import { getPostsByAuthor } from "api";
import { useAuthContext } from "contexts";
import { useQuery } from "react-query";
import { filterData, sortData } from "./ParamsConstants";
import "./style.scss";

export const MyPostsPage: React.FunctionComponent<RouteComponentProps> = () => {
  const filterBy = useInput(filterData[0].id);
  const sortBy = useInput(sortData[0].id);
  const { userId } = useAuthContext();
  const { isLoading, isError, error, data, refetch } = useQuery<any[], Error>(
    ["myPosts", sortBy.value, filterBy.value],
    () =>
      getPostsByAuthor({
        authorId: userId,
        ordering: sortBy.value,
        ...(filterBy.value && { [filterBy.value]: 0 }),
      }),
    {
      keepPreviousData: true,
    }
  );

  return (
    <ForumsLayout tab="My Posts" onCreatePost={() => refetch()}>
      <div className="forums-page__my-posts">
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
          {isLoading ? (
            <FolderItem>
              <RiseLoader className="my-4" />
            </FolderItem>
          ) : isError ? (
            <div className="my-2 text-center">{error}</div>
          ) : data && data.length > 0 ? (
            data.map((post, index) => {
              return (
                <FolderItem key={`${index}key`}>
                  <Post {...post} isMyPost={true}/>
                </FolderItem>
              );
            })
          ) : (
            <FolderItem>
              <div className="my-2 text-center text-gray">
                My posts will appear here.
              </div>
            </FolderItem>
          )}
        </Folder>
      </div>
    </ForumsLayout>
  );
};
