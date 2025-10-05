import React, { useEffect } from "react";
import { RouteComponentProps } from "@reach/router";
import { Folder, FolderItem, Select, RiseLoader, Pagination } from "components";
import { useInput } from "hooks";
import { EngagementLayout, MediatorLayout } from "../../layouts";
import { Topic, RecentPost } from "./components";
import { getPostedMatters, getPostedMatterTopics } from "api";
import { useQuery } from "react-query";
import { useAuthContext } from "contexts";

const sortTopic = [
  {
    title: "Alphabetical",
    id: "title",
  },
  {
    title: "Most Recent",
    id: "-last_posted",
  },
  {
    title: "Popular",
    id: "-posted_matters_count",
  },
];
export const EngagementInquiriesPage: React.FunctionComponent<RouteComponentProps> =
  () => {
    const topcSortBy = useInput(sortTopic[0].id);
    const page = useInput(0);
    const { profile, userType, userId } = useAuthContext();

    const {
      isLoading: isRecentLoading,
      isError: isRecentError,
      error: recentError,
      data: recentData,
    } = useQuery<{ results: any[]; count: number }, Error>(
      ["posted-matters"],
      () =>
        getPostedMatters({
          page: 0,
          pageSize: 3,
          ordering: "-created",
          status: 'active',
        }),
      {
        keepPreviousData: true,
      }
    );

    const {
      isLoading: isTopicsLoading,
      isError: isTopicsError,
      error: topicsError,
      data: topicsData,
      refetch
    } = useQuery<{ results: any[]; count: number }, Error>(
      ["posted-matter-topics"],
      () =>
        getPostedMatterTopics({
          page: page.value,
          pageSize: 10,
          ordering: topcSortBy.value
        }),
      {
        keepPreviousData: true,
      }
    );

    useEffect(() => {
      if (isTopicsLoading) return;
      refetch();
    }, [page.value, topcSortBy.value]);

    return (
      <MediatorLayout title="Potential Engagement" showButtons={false} userType={userType}>
        <EngagementLayout tab="Browse Inquiries" userType={userType}>
          <div className="forums-page__all-posts">
            <Folder label="Recent Posts">
              {isRecentLoading ? (
                <FolderItem>
                  <RiseLoader className="my-4" />
                </FolderItem>
              ) : isRecentError ? (
                <FolderItem>
                  <div className="text-center my-4 text-gray">
                    {recentError}
                  </div>
                </FolderItem>
              ) : recentData && recentData.results.length === 0 ? (
                <FolderItem>
                  <div className="my-4 text-center text-gray">
                    No Recent Posts
                  </div>
                </FolderItem>
              ) : (
                <div className="d-flex">
                  {recentData &&
                    recentData.results.map((item, index) => (
                      <RecentPost 
                        key={`${index}key`} 
                        data={item} 
                        userId={+userId} 
                        userType={userType}
                      />
                    ))}
                </div>
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
                  alignRight
                  width={120}
                />
              </div>
              {isTopicsLoading ? (
                <FolderItem>
                  <RiseLoader className="my-4" />
                </FolderItem>
              ) : isTopicsError ? (
                topicsError
              ) : (
                <div>
                  {topicsData && topicsData.results.length === 0 ? (
                    <FolderItem>
                      <div className="my-4 text-center text-gray">
                        No Topics & Practice Areas
                      </div>
                    </FolderItem>
                  ) : (
                    topicsData &&
                    topicsData.results.map((item, index) => (
                      <FolderItem key={`${index}key`}>
                        <Topic data={item} userType={userType} />
                      </FolderItem>
                    ))
                  )}
                </div>
              )}
            </Folder>
            {!isTopicsLoading && !isTopicsError && (
              <div className="mt-3 pb-4">
                <Pagination tatalCount={topicsData?.count} {...page} />
              </div>
            )}
          </div>
        </EngagementLayout>
      </MediatorLayout>
    );
  };