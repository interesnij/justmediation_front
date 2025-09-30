import React, { useEffect } from "react";
import { Tab, SearchBar, IconButton } from "components";
import { forumsTabs } from "config";
import { useAuthContext } from "contexts";
import { NewPostModal } from "modals";
import { useModal, useInput } from "hooks";
import { RouteComponentProps, navigate, useLocation } from "@reach/router";
import { parse } from "query-string";
import "./style.scss";

interface Props extends RouteComponentProps {
  children: React.ReactNode;
  tab?: string;
  onCreatePost?(): void;
}

export const ForumsLayout = ({
  children,
  tab,
  onCreatePost = () => {},
}: Props) => {
  const { userType } = useAuthContext();
  const tabsData = forumsTabs.map((item) => {
    return {
      ...item,
      path: `/${userType}${item.path}`,
    };
  });
  const currentTab = useInput(tab || tabsData[0].tab);
  const location = useLocation();
  const { query } = parse(location.search);
  const search = useInput(query);
  const postModal = useModal();

  const handleNewPost = () => {
    postModal.setOpen(true);
  };
  const handleEnter = (params: string) => {
    navigate(`/${userType}/forums/search/?query=${params}`);
  };

  useEffect(() => {
    search.onChange(query);
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="forums-page">
      <div className="d-flex">
        {!location.pathname.trim().endsWith("forums/search/") && (
          <Tab data={tabsData} {...currentTab} />
        )}
        <div className="forum-layout-bar flex-1">
          <SearchBar
            icon="search"
            placeholder="Search in forums"
            className="my-auto mr-auto flex-1"
            onEnter={handleEnter}
            {...search}
          />
          <IconButton
            className="ml-3 my-auto"
            toolTip="New Post"
            onClick={handleNewPost}
            type="post"
          />
        </div>
      </div>
      <div className="forums-page__content">{children}</div>
      {
        postModal?.open &&
        <NewPostModal {...postModal} onCreate={onCreatePost} />
      }
    </div>
  );
};
