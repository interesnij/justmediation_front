import React, { useEffect, useMemo } from "react";
import { Folder, FolderItem, RiseLoader } from "components";
import { RouteComponentProps } from "@reach/router";
import { Recentmatter } from "./components/RecentMatter";
import { useAuthContext } from "contexts";
import { RecentDocument } from "./components/RecentDocument";
import { UpcomingBill } from "./components/UpcomingBill";
import { useQuery } from "react-query";
import { getClientOverview } from "api";
import { DashboardLayout } from "apps/client/layouts";
import { useModal } from "hooks";
import { WelcomeModal } from "modals";
import "./style.scss";

export const OverviewPage: React.FunctionComponent<RouteComponentProps> =
  () => {
    const { userId, tfa } = useAuthContext();
    const welcomeModal = useModal();

    const { isLoading, isError, error, data } = useQuery<any, Error>(
      ["client-overview", userId],
      () => getClientOverview(userId),
      {
        keepPreviousData: true,
        enabled: !!userId
      }
    );

    useEffect(() => {
      // if user setup 2FA already, no need to show modal
      if (!tfa){
        let val = localStorage.getItem("tfa");
        if (val !== "shown") {
          welcomeModal.setOpen(true);
        }
      }
      return () => {};
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const upcomingBillsItem = useMemo(() => {
      let newData = [];
      if(data?.upcoming_bills?.length) {
        newData = data?.upcoming_bills.filter(({status}) => status === "overdue" || status === "open")
      }
      return newData.slice(0, 2);
    }, [data?.upcoming_bills])

    return (
      <DashboardLayout tab="Overview">
        <div className="client-overview-page">
          <div className="client-overview-page__left">
            <Folder label="Recent Matters" viewAll="/client/overview/matters">
              {isLoading ? (
                <FolderItem className="d-flex py-4">
                  <RiseLoader className="my-4" />
                </FolderItem>
              ) : isError ? (
                <div className="my-2 text-center">{error}</div>
              ) : data && data.recent_matters.length > 0 ? (
                data.recent_matters.slice(0, 2).map((matter, index) => (
                  <FolderItem key={`${index}key`}>
                    <Recentmatter data={matter} />
                  </FolderItem>
                ))
              ) : (
                <FolderItem>
                  <div className="my-3 text-gray text-center">Empty</div>
                </FolderItem>
              )}
            </Folder>
            <Folder label="Recent Documents" className="mt-4">
              {isLoading ? (
                <FolderItem className="d-flex py-4">
                  <RiseLoader className="my-4" />
                </FolderItem>
              ) : isError ? (
                <div className="my-2 text-center">{error}</div>
              ) : data && data.recent_documents.length > 0 ? (
                data.recent_documents.slice(0, 2).map((document, index) => (
                  <FolderItem key={`${index}key`}>
                    <RecentDocument data={document} />
                  </FolderItem>
                ))
              ) : (
                <FolderItem>
                  <div className="my-3 text-gray text-center">
                    {" "}
                    Your recent documents will appear here.
                  </div>
                </FolderItem>
              )}
            </Folder>
          </div>
          <div className="client-overview-page__right">
            <Folder label="Upcoming Bills" viewAll="/client/overview/invoices">
              {isLoading ? (
                <FolderItem className="d-flex py-4">
                  <RiseLoader className="my-4" />
                </FolderItem>
              ) : isError ? (
                <div className="my-2 text-center">{error}</div>
              ) : data && upcomingBillsItem.length > 0 ? (
                upcomingBillsItem.map((bill, index) => (
                  <FolderItem key={`${index}key`}>
                    <UpcomingBill data={bill} />
                  </FolderItem>
                ))
              ) : (
                <FolderItem>
                  <div className="my-3 text-gray text-center">
                    Your upcoming bills will appear here.
                  </div>
                </FolderItem>
              )}
            </Folder>
          </div>
        </div>
        {
          welcomeModal?.open &&
            <WelcomeModal
              {...welcomeModal}
            />
        }
      </DashboardLayout>
    );
  };
