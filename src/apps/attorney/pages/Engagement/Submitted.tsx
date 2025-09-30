import React, { useEffect } from "react";
import { Folder, FolderItem, RiseLoader, Pagination } from "components";
import { RouteComponentProps } from "@reach/router";
import { useInput } from "hooks";
import { AttorneyLayout, EngagementLayout } from "apps/attorney/layouts";
import { ActivePost, InactivePost } from "./components";
import { getEngagements } from "api";
import { useQuery } from "react-query";
import { useAuthContext } from "contexts";

export const EngagementSubmittedPage: React.FunctionComponent<RouteComponentProps> =
  () => {
    const { userId, userType } = useAuthContext();
    const activesPage = useInput(0);
    const countPerPage = 10;

    const { 
      isLoading: isActivesLoading, 
      isError: isActiveError, 
      error: activesError, 
      data: activesData,
      refetch: refetchActive 
    } = useQuery<
      { results: any[], count: number },
      Error
    >(["active-engagements", userId], () => getEngagements(userId, {
      page: activesPage.value,
      pageSize: countPerPage,
      isActive: 1
    }), {
      keepPreviousData: true,
    });

    const inactivesPage = useInput(0);
    const { 
      isLoading: isInactivesLoading, 
      isError: isInactiveError, 
      error: inactivesError, 
      data: inactivesData,
      refetch: refetchInactive
    } = useQuery<
      { results: any[], count: number },
      Error
    >(["inactive-engagements", userId], () => getEngagements(userId, {
      page: inactivesPage.value,
      pageSize: countPerPage,
      isActive: 0
    }), {
      keepPreviousData: true,
    });

    useEffect(() => {
      refetchActive();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activesPage.value])

    useEffect(() => {
      refetchInactive();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inactivesPage.value])

    return (
      <AttorneyLayout title="Potential Engagement" showButtons={false} userType={userType}>
        <EngagementLayout tab="Submitted Engagements" userType={userType}>
          <div className="forums-page__topic submitted-page">
            <Folder label="Active Engagement">
              {isActivesLoading ? (
                <FolderItem>
                  <RiseLoader className="my-4" />
                </FolderItem>
              ) : isActiveError ? (
                <FolderItem>
                  <div className="my-4 text-center">{activesError}</div>
                </FolderItem>
              ) : activesData?.results?.length ? (
                <>
                  {activesData.results
                    .filter(item => item.status !== 'withdrawn')
                    .map((item, index) => (
                      <FolderItem key={`active-engagement-${index}`}>
                        <ActivePost item={item} userType={userType} />
                      </FolderItem>
                    ))
                  }
                </>
              ) : (
                <FolderItem>
                  <div className="my-4 text-center">No active engagements</div>
                </FolderItem>
              )}
            </Folder>
            {!isActivesLoading && !isActiveError && activesData && activesData.count > countPerPage && (
              <div className="mt-3">
                <Pagination 
                  {...activesPage} 
                  tatalCount={activesData?.count} 
                  countPerPage={countPerPage}
                  />
              </div>
            )}
            <Folder label="Inactive" className="mt-4">
              {isInactivesLoading ? (

                <FolderItem>
                  <RiseLoader className="my-4" />
                </FolderItem>
              ) : isInactiveError ? (
                <FolderItem>
                  <div className="my-4 text-center">{inactivesError}</div>
                </FolderItem>
              ) : inactivesData?.results?.length  ? (
                inactivesData.results
                  .filter(item => item.status !== 'withdrawn')
                  .map((item, index) => (
                    <FolderItem key={`inactive-engagement-${index}`}>
                      <InactivePost item={item} refetch={refetchInactive} userType={userType} />
                    </FolderItem>
                  ))
              ) : (
                <FolderItem>
                  <div className="my-4 text-center">
                    No inactive engagements
                  </div>
                </FolderItem>
              )}
            </Folder>
            {!isInactivesLoading && !inactivesError && inactivesData && inactivesData.count > countPerPage && (
              <div className="mt-3 pb-4">
                <Pagination 
                  {...inactivesPage} 
                  tatalCount={inactivesData?.count} 
                  countPerPage={countPerPage}
                  />
              </div>
            )}
          </div>
        </EngagementLayout>
      </AttorneyLayout>
    );
  };