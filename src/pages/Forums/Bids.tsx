import React from "react";
import { Post, Select, Folder, FolderItem } from "components";
import { myPosts } from "config";
import { useInput } from "hooks";
import { RouteComponentProps } from "@reach/router";
import { ForumsLayout } from "layouts";

import "./style.scss";

const filterData = [
  {
    title: "All",
    id: "All",
  },
  {
    title: "No Replies",
    id: "noReplies",
  },
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
export const BidsPage: React.FunctionComponent<RouteComponentProps> = () => {
  const filterBy = useInput(filterData[0].id);
  const sortBy = useInput(sortData[0].id);
  return (
    <ForumsLayout tab="My Posts for Bids">
      <div className="forums-page__my-posts">
        <Folder label="My Posts for Mediator Bids">
          <div className="folder__filter d-flex">
            <Select data={filterData} {...filterBy} label="Filter by" />
            <Select
              data={sortData}
              {...sortBy}
              label="Sort by"
              className="ml-3"
            />
          </div>
          {myPosts.map((post, index) => {
            return (
              <FolderItem key={`${index}key`}>
                <Post {...post} />
              </FolderItem>
            );
          })}
        </Folder>
      </div>
    </ForumsLayout>
  );
};
