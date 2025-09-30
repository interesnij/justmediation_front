import React from "react";
import { RouteComponentProps, Router } from "@reach/router";
import { AttorneyLayout } from "apps/attorney/layouts";
import { useAuthContext } from "contexts";
import {
  AllPostsPage,
  MyPostsPage,
  FollowingPage,
  PostPage,
  TopicPage,
  SearchPage,
} from "pages";

export const ForumsRouter: React.FC<RouteComponentProps> = () => {
  const { userType } = useAuthContext();
  return (
    <AttorneyLayout showButtons={false} title="Forums" userType={userType}>
      <Router>
        <AllPostsPage path="/" />
        <AllPostsPage path="all-posts" />
        <FollowingPage path="/following" />
        <PostPage path="post/:id" />
        <TopicPage path="topic/:id" />
        <MyPostsPage path="my-posts" />
        <PostPage path="my-posts/:id" />
        <SearchPage path="search" />
      </Router>
    </AttorneyLayout>
  );
};
