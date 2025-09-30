import React, { useEffect, useState } from "react";
import { RouteComponentProps, Link } from "@reach/router";
import { getChatTabs, sortChatData } from "config";
import { Folder, FolderItem, RiseLoader, RecentActivity } from "components";
import { useQuery } from "react-query";
import numeral from "numeral";
import { AttorneyLayout } from "apps/attorney/layouts";
import OpenMatters from "./components/OpenMatters";
import { getProfileOverview } from "api";
import { useAuthContext, useMatterContext, useContextSubscriptionAccess } from "contexts";
import { ChatSection } from "./components/ChatSection";
import { useModal, useChatLists } from "hooks";
import { WelcomeModal } from "modals";
import { filterChatList, updateUnreads } from "helpers";
import "./style.scss";

export const HomePage: React.FunctionComponent<RouteComponentProps> = (
  props: RouteComponentProps
) => {
  const { userType, userId, tfa, profile } = useAuthContext();
  const {hasSubscription} = useContextSubscriptionAccess()
  const { createdId } = useMatterContext();
  const welcomeModal = useModal();
  const {threadData} = useChatLists();
  const [tabData, setTabData] = useState(getChatTabs(userType));
  const [chatLists, setChatLists] = useState<any[]>([])
  const {
    isLoading: isOverviewLoading,
    isError: isOverviewError,
    error: overviewError,
    data: overviewData,
    refetch: refetchOverview,
  } = useQuery<any, Error>(
    ["profile-overview", userId],
    () => getProfileOverview(userType, userId, profile.role),
    {
      keepPreviousData: true,
      enabled: !!userId && !!userType
    }
  );

  useEffect(() => {
    if (!threadData.length) return;
    setChatLists(
      filterChatList(threadData, false, sortChatData[0].id)
    )
    setTabData(
      updateUnreads(threadData, tabData, undefined, true)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadData]);

  useEffect(() => {
    if (!tfa){
      let val = localStorage.getItem("tfa");
      if (val !== "shown") {
        welcomeModal.setOpen(true);
      }
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (createdId){
      refetchOverview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdId]);

  return (
    <AttorneyLayout title="Overview" userType={userType}>
      <div className="home-page">
        <Folder label="Billing" className="billing-block">
          <FolderItem>
            {isOverviewLoading ? (
              <RiseLoader className="my-4" />
            ) : isOverviewError ? (
              <div className="my-3 text-center text-gray">
                {overviewError}
              </div>
            ) : (
              <div className="row">
                <Link to={`/${userType}/invoices?filter=paid`} className="col-md-6">
                  <div className="text-gray">Paid</div>
                  <div className="text-lg-black">
                    {numeral(overviewData?.billing?.paid).format("$0,0.00")}
                  </div>
                  <div className="divider my-1" />
                </Link>
                <Link to={`/${userType}/invoices?filter=overdue`} className="col-md-6">
                  <div className="text-gray">Overdue</div>
                  <div className="text-lg-black">
                    {numeral(overviewData?.billing?.overdue).format("$0,0.00")}
                  </div>
                  <div className="divider my-1" />
                </Link>
                <Link to={`/${userType}/billing`} className="col-md-6">
                  <div className="text-gray">Unbilled</div>
                  <div className="text-lg-black">
                    {numeral(overviewData?.billing?.un_billed).format("$0,0.00")}
                  </div>
                </Link>
                <Link to={`/${userType}/invoices?filter=open`} className="col-md-6">
                  <div className="text-gray">Unpaid</div>
                  <div className="text-lg-black">
                    {numeral(overviewData?.billing?.unpaid).format("$0,0.00")}
                  </div>
                </Link>
              </div>
            )}
          </FolderItem>
        </Folder>
        <div className="row mt-4">
          {(userType !== "attorney" || hasSubscription) &&
            <div className="col-md-8">
           <Folder label="Chat" viewAll={`/${userType}/chats`}>
           {(userType === "attorney" || profile.role==="Attorney") &&  <ChatSection
                type="opportunities"
                userType={userType}
                isLoading={isOverviewLoading}
                isError={isOverviewError}
                error={overviewError}
                tabData={tabData}
                chatLists={chatLists}
              />}
              <ChatSection 
                type="clients"
                userType={userType}
                isLoading={isOverviewLoading}
                isError={isOverviewError}
                error={overviewError}
                tabData={tabData}
                chatLists={chatLists}
              />
            </Folder>
            <Folder
              label="Open Matters"
              className="mt-4"
              viewAll={`/${userType}/matters`}
            >
              {isOverviewLoading ? (
                <FolderItem>
                  <RiseLoader className="my-4" />
                </FolderItem>
              ) : isOverviewError ? (
                <div className="my-3 text-center text-gray">
                  {overviewError}
                </div>
              ) : (
                <OpenMatters
                  data={overviewData?.open_matters || []}
                  onUpdate={() => refetchOverview()}
                  userType={userType}
                /> 
              )}
            </Folder>
          </div>}
          <div className="col-md-4">
            <Folder label="Recent Activities">
              {isOverviewLoading ? (
                <FolderItem>
                  <RiseLoader className="my-4" />
                </FolderItem>
              ) : isOverviewError ? (
                <div className="my-3 text-center text-gray">
                  {overviewError}
                </div>
              ) : overviewData?.activities &&
                overviewData?.activities.length > 0 ? (
                overviewData?.activities.map((item, index) => (
                  <FolderItem key={`${index}key`}>
                    <RecentActivity data={item} />
                  </FolderItem>
                ))
              ) : (
                <FolderItem>
                  <div className="my-4 text-center text-gray">
                    Your recent activities will appear here
                  </div>
                </FolderItem>
              )}
            </Folder>
          </div>
        </div>
      </div>
      {
        welcomeModal?.open &&
        <WelcomeModal
          {...welcomeModal}
        />
      }
    </AttorneyLayout>
  );
};
