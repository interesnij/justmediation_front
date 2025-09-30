import React from "react";
import { RouteComponentProps, Router } from "@reach/router";

import { ClientLayout } from "apps/client/layouts";

import {
  AllPostsPage,
  MyPostsPage,
  FollowingPage,
  PostPage,
  TopicPage,
  SearchPage,
} from "pages";

export const ForumsRouter: React.FC<RouteComponentProps> = () => {
  return (
    <ClientLayout showButtons={false} title="Forum">
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
    </ClientLayout>
  );
};
