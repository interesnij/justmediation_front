import React, { useState } from "react";
import { RouteComponentProps, useParams, useLocation } from "@reach/router";
import { Tab, IconButton, User, MultiUsers, ScaleLoader } from "components";
import { Link } from "@reach/router";
import { useInput, useModal } from "hooks";
import { useQuery } from "react-query";
import { ClientLayout } from "apps/client/layouts";
import { getMatterById } from "api";
import { getUserName } from "helpers";
import Overview from "./Overview";
import Messages from "./Messages";
import Documents from "./Documents";
import Invoices from "./Invoices";
import { useAuthContext, useChatContext } from "contexts";
import { CallParticipantsModal, CallStartModal, ShareDetailModal } from "modals"; 
import "./style.scss";

export const ClientMatterPage: React.FunctionComponent<RouteComponentProps> =
  () => {
    const params = useParams();
    const location = useLocation();
    const callParticipants = useModal();
    const { userId, profile } = useAuthContext();
    const { onStartCall } = useChatContext();
    const [participants, setParticipants] = useState<any[]>([]);
    const callStartModal = useModal();
    const sharedModal = useModal();

    const currentTab = useInput(
      location.pathname.endsWith("messages")
        ? "Messages"
        : location.pathname.endsWith("documents")
        ? "Documents"
        : location.pathname.endsWith("invoices")
        ? "Invoices & Payments"
        : "Overview"
    );
    const {
      isLoading: isMatterLoading,
      isError: isMatterError,
      error: matterError,
      data: matterData,
      refetch: matterRefetch,
    } = useQuery<any, Error>(
      ["matters-overview", params.id],
      () => getMatterById(params.id),
      {
        keepPreviousData: true,
      }
    );

    const tabData = [
      {
        tab: "Overview",
        path: `/client/overview/matter/${params.id}`,
      },
      {
        tab: "Messages",
        badge: matterData?.unread_message_count || 0,
        path: `/client/overview/matter/${params.id}/messages`,
      },
      {
        tab: "Documents",
        path: `/client/overview/matter/${params.id}/documents`,
      },
      {
        tab: "Invoices & Payments",
        badge: 0,
        path: `/client/overview/matter/${params.id}/invoices`,
      },
    ];

    /**
     * Handle call click
     *
     */
    const handleCallClick = () => {
      if (!matterData) return;
      const currentParticipants: any[] = [
        getPerson(matterData?.client_data),
        getPerson(matterData?.attorney_data),
      ]
        .concat(matterData.shared_with_data)
        .filter((person) => person.id !== +userId);
      //
      setParticipants(currentParticipants);
      //
      currentParticipants.length > 1 && !document.querySelector('.vxt-modal-close-btn > .icon-close')
        ? callParticipants.setOpen(true)
        : callStartModal.setOpen(true);
    };
    /**
     * Get person object
     *
     */
    const getPerson = (personData) => {
      if (!personData) return {};
      return {
        id: personData.id,
        first_name: personData.first_name,
        last_name: personData.last_name,
        avatar: personData.avatar,
      };
    };

    const handleSharedClick = () => {
      sharedModal.setOpen(true);
    }

    return (
      <ClientLayout
        title="Back to Dashboard"
        backUrl="/client/overview/matters"
      >
        <div className="matter-detail-page__bar">
          {isMatterLoading ? (
            <ScaleLoader className="mx-auto" />
          ) : isMatterError ? (
            matterError
          ) : (
            <>
              <span className="my-auto">{matterData?.title}</span>
              <div className="d-flex">
                <span className="text-gray my-auto mr-2">ATTORNEY:</span>
                <Link className="profile-link" to={`/client/find/attorneys/${matterData?.attorney}`}>
                  <User
                    userName={getUserName(matterData?.attorney_data)}
                    avatar={matterData?.attorney_data?.avatar}
                  />
                </Link>
                {matterData?.shared_with_data?.length > 0 && (
                  <>
                    <span className="text-gray my-auto ml-4">SHARED:</span>
                    <MultiUsers
                      className="ml-3 overlapping-avatars"
                      data={matterData?.shared_with_data}
                      onClick={handleSharedClick}
                    />
                  </>
                )}
                <IconButton
                  type="call"
                  className="ml-4 my-auto"
                  toolTip="Call"
                  onClick={handleCallClick}
                />
              </div>
            </>
          )}
        </div>
        <Tab data={tabData} {...currentTab} />
        <div className="matter-detail-page__content">
          {location.pathname.endsWith("messages") ? (
            <Messages
              matterData={matterData}
              onUpdate={() => matterRefetch()}
            />
          ) : location.pathname.endsWith("documents") ? (
            <Documents matterData={matterData} />
          ) : location.pathname.endsWith("invoices") ? (
            <Invoices />
          ) : (
            <Overview matterData={matterData} />
          )}
        </div>
        {
          callParticipants?.open &&
          <CallParticipantsModal
            {...callParticipants}
            allParticipants={participants}
            onCreate={userIds => onStartCall({ participants: participants.map((p) => p.id) }, userIds)}
          />
        }
        {
          sharedModal?.open &&
          <ShareDetailModal
            {...sharedModal}
            data={matterData?.shared_with_data}
          />
        }
        <CallStartModal 
          {...callStartModal} 
          onConfirm={() => onStartCall({ participants: participants.map((p) => p.id) })} 
          participants={participants} 
          userId={profile?.id} 
        />
      </ClientLayout>
    );
  };
