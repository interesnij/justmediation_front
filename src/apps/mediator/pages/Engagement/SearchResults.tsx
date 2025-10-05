import React, { useEffect } from "react";
import { RouteComponentProps, useLocation, navigate } from "@reach/router";
import { Folder, FolderItem, Select, RiseLoader, Pagination, SearchBar, Breadcrumb } from "components";
import { useInput } from "hooks";
import { MediatorLayout } from "./../../layouts";
import { Post } from "./components";
import { getPostedMatters } from "api";
import { useQuery } from "react-query";
import { parse } from "query-string";
import { useAuthContext } from "contexts";

const sortData = [
    {
      title: "Most Recent",
      id: "-id",
    },
    {
      title: "Oldest",
      id: "id",
    }
];
export const EngagementSearchResultsPage: React.FunctionComponent<RouteComponentProps> =
  () => {    
    const { userType } = useAuthContext();
    const location = useLocation();
    const sortBy = useInput(sortData[0].id);
    const page = useInput(0);
    const searchQuery = parse(location.search) || {};
    const q = Array.isArray(searchQuery.q) ? searchQuery.q[0] : searchQuery.q;

    const { refetch, isFetching: isLoading, isError, error, data } = useQuery<{ results: any[]; count: number }, Error>(
      ["search-posted-matters"],
      () => getPostedMatters({
        page: page.value,
        pageSize: 10,
        ordering: sortBy.value || "-id",
        search: q || undefined
      }),
      {
        keepPreviousData: false,
        enabled: !!q && q.length > 1
      }
    );

    useEffect(() => {
      if (isLoading || !q || q.length <= 2) return;
      refetch();
    }, [q]);

    useEffect(() => {
      if (isLoading) return;
      refetch();
    }, [page.value, sortBy.value]);

    const handleSeach = (searchString?: string) => {
      if (!searchString || searchString.length<=2) return;
      navigate(`/${userType}/engagement/search?q=${searchString}`);
    }

    return (
      <MediatorLayout title="Potential Engagement Search Results" showButtons={false} userType={userType}>
        <div className="forums-page search-results-page">
          <div>
            <div className="forum-layout-bar">
              <SearchBar
                icon="search"
                placeholder="Search in Potential Engagements"
                className="my-auto"
                onEnter={handleSeach}
                value={q || ""}
              />
            </div>
          </div>
        
          <div className="forums-page__all-posts" style={{background: '#F4F5F9'}}>
            {isLoading ? (
              <div className="post-page__post mt-3">
                  <RiseLoader className="my-4" />
              </div>
              ) : isError ? (
              <div className="post-page__post mt-3">
                  <div className="my-4 text-center text-gray">{error}</div>
              </div>
            ) : (
              <>
                <Breadcrumb
                  previous={[
                    {
                      label: "Submitted Engagements",
                      url: `/${userType}/engagement`,
                    },
                  ]}
                  current={`Search Results for: "${q}"`}
                  className="mb-3"
                />                
                <Folder label={`Posts (${data?.count} Results)`} className="mt-4">
                {data?.results && data?.results.length 
                  ? data.results.map((post, index) => {
                    return (
                      <FolderItem key={`${index}key`}>
                        <Post post={{...post, withProposal: true}} userType={userType} />
                      </FolderItem>
                    );
                  })
                  : (
                    <FolderItem>
                      <div className="my-4 text-center">No posts found</div>
                    </FolderItem>
                  )
                }
                <div className="folder__filter d-flex">
                    <Select data={sortData} label="Sort by" {...sortBy} />
                </div>
                </Folder>{" "}
                {!isLoading && !isError && (
                <div className="mt-3 pb-4">
                    <Pagination tatalCount={data?.count} {...page} />
                </div>
                )}
              </>
            )}
          </div>
        </div>
      </MediatorLayout>
    );
  };
