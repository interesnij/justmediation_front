/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  RouteComponentProps,
  useParams,
  navigate,
  useLocation,
} from "@reach/router";
import { Select, Dropdown, Tab, IconButton, ScaleLoader } from "components";
import { useInput, useModal } from "hooks";
import { FaEllipsisH } from "react-icons/fa";
import {
  getClientById,
  createChat,
  getUserInvites,
  updateUserTypeClientLead,
} from "api";
import {useAuthContext, useChatContext, useContextSubscriptionAccess} from "contexts";
import { AttorneyLayout } from "apps/attorney/layouts";
import { useQuery } from "react-query";
import { parse } from "query-string";
import {
  NewMatterModal,
  AddBillingItemModal,
  InvoiceModal,
  DeleteClientModal,
  EditContactModal,
  ShareContactModal,
  CallStartModal
} from "modals";
import { getUserName } from "helpers";
import Overview from "./Overview";
import Documents from "./Documents";
import { Matters } from "./Matters";
import "./style.scss";

const typeData = [
  {
    title: "Client",
    id: "client",
  },
  {
    title: "Lead",
    id: "lead",
  },
];
const actionData = [
  {
    label: "Create new matter",
    action: "matter",
  },
  {
    label: "Direct chat",
    action: "chat",
  },
  {
    label: "Add billable items",
    action: "bill",
  },
  {
    label: "Create an invoice",
    action: "invoice",
  },
  {
    label: "Share with",
    action: "share",
  },
  {
    label: "Delete",
    action: "delete",
  },
];
const leadActionData = [
  {
    label: "Create new matter",
    action: "matter",
  },
  {
    label: "Direct chat",
    action: "chat",
  },
  {
    label: "Share with",
    action: "share",
  },
  {
    label: "Delete",
    action: "delete",
  },
];
const tabData = [
  {
    tab: "Overview",
  },
  {
    tab: "Matters",
  },
  {
    tab: "Documents",
  },
];
const leadTabData = [
  {
    tab: "Overview",
  },
  {
    tab: "Documents",
  },
];
export const LeadDetailPage: React.FunctionComponent<RouteComponentProps> =
  () => {
    const matterModal = useModal();
    const billModal = useModal();
    const invoiceModal = useModal();
    const deleteModal = useModal();
    const currentTab = useInput(tabData[0].tab);
    const params = useParams();
    const location = useLocation();
    const editModal = useModal();
    const shareModal = useModal();
    const type = parse(location.search)?.type;
    const { userId, profile, userType } = useAuthContext();
    const { hasSubscription } = useContextSubscriptionAccess();
    const clientType = useInput("");
    const [chat, setChat] = useState<any>(null);
    const { onStartCall } = useChatContext();
    const callStartModal = useModal();
    const {
      isLoading: isDetailLoading,
      isError: isDetailError,
      error: detailError,
      data: detailData,
      refetch,
    } = useQuery<any, Error>(
      ["lead-detail", params.id],
      () =>
        type === "client" || type === "lead"
          ? getClientById(params.id)
          : type === "pending"
          ? getUserInvites(params.id)
          : null,
      {
        keepPreviousData: true,
      }
    );

    useEffect(() => {
      if (detailData) {
        clientType.onChange(detailData?.type);
      }
      return () => {};
    }, [detailData]);

    useEffect(() => {
      if (clientType.value === "lead" && type === "client") {
        clientType.onChange("client");
      } else if (type === "lead" && clientType.value === "client") {
        updateUserTypeClientLead(userId, detailData?.id);
      }
      return () => {};
    }, [clientType.value]);

    const handleEditContact = () => {
      editModal.setOpen(true);
    };

    const getChat = async () => {
      if (chat) return chat;
      const data = await createChat({
        participants: [params.id],
        is_group: 0,
      });
      setChat(data);
      return data;
    };

    const handleAction = async (action) => {
      switch (action) {
        case "matter":
          matterModal.setOpen(true);
          break;
        case "chat":
          const data = await getChat();
          if (type === "client") {
            navigate(`/${userType}/chats/clients?id=${data?.id}`);
          } else {
            navigate(`/${userType}/chats/leads?id=${data?.id}`);
          }
          break;
        case "bill":
          billModal.setOpen(true);
          break;
        case "invoice":
          invoiceModal.setOpen(true);
          break;
        case "share":
          shareModal.setOpen(true);
          break;
        case "delete":
          deleteModal.setOpen(true);
          break;

        default:
          break;
      }
    };

    /**
     * Filter out actions allowed only to attorney/enterprise type users
     */
     const filterActions = (menu: {
      label: string;
      action: string;
    }[]) => {
      const attorneyOnlyActions = [
        'matter',
        'delete'
      ]; 
      return userType && ['paralegal', 'other'].indexOf(userType) !== -1
        ? menu.filter(item => attorneyOnlyActions.indexOf(item.action) === -1) 
        : menu;
    }

    return (
      <AttorneyLayout 
        title="Back to Leads & Clients" 
        backUrl={`/${userType}/leads`}
        userType={userType}
      >
        <div className="lead-detail-page__bar">
          {isDetailLoading ? (
            <ScaleLoader className="m-auto" />
          ) : isDetailError ? (
            detailError
          ) : (
            <>
              <span className="my-auto">{getUserName(detailData)}</span>
              {hasSubscription &&
                <div className="d-flex">
                  {type !== "pending" && (
                    <>
                      <Select data={typeData} {...clientType} />
                      <IconButton
                        type="call"
                        className="ml-3 my-auto"
                        toolTip="Call"
                        onClick={() => callStartModal.setOpen(true)}
                      />
                    </>
                  )}
                  <IconButton
                    type="edit"
                    className="ml-3 my-auto"
                    toolTip="Edit Contact"
                    onClick={handleEditContact}
                  />
                  <Dropdown
                    data={
                      type === "client"
                        ? filterActions(actionData).filter(
                            (a) =>
                              !(
                                a?.action === "delete" &&
                                detailData?.matters_count > 0
                              )
                          )
                        : filterActions(leadActionData)
                    }
                    onActionClick={handleAction}
                    className="ml-3"
                  >
                    <FaEllipsisH className="matters-action-button" />
                  </Dropdown>
                </div>
              }
            </>
          )}
        </div>
        <Tab
          data={
            type === "client" ? tabData : type === "lead" ? leadTabData : []
          }
          {...currentTab}
        />
        <div className="lead-detail-page__content d-flex flex-column">
          {currentTab.value === "Overview" ? (
            <Overview
              data={detailData}
              isLoading={isDetailLoading}
              error={detailError}
              type={type}
            />
          ) : currentTab.value === "Matters" ? (
            <Matters userData={detailData} />
          ) : currentTab.value === "Documents" ? (
            <Documents />
          ) : null}
        </div>

        {
          billModal?.open &&
          <AddBillingItemModal {...billModal} client={params.id} />
        }
        {
          invoiceModal?.open &&
          <InvoiceModal {...invoiceModal} client={params.id} />
        }
        {
          deleteModal?.open &&
          <DeleteClientModal
            type={
              detailData?.type === "lead" && detailData?.is_pending
                ? "pending"
                : detailData?.type === "lead" && !detailData?.is_pending
                ? "lead"
                : "client"
            }
            {...deleteModal}
            data={detailData}
            onOk={() => navigate(`/${userType}/leads`)}
          />
        }
        {detailData && (
          <>
            {
              matterModal?.open &&
              <NewMatterModal
                {...matterModal}
                client={params.id}
                clientData={{
                  name: getUserName(detailData),
                  organization_name: detailData?.organization_name || detailData?.company || "",
                  job: detailData?.job,
                  phone: detailData?.phone,
                  email: detailData?.email,
                  avatar: detailData?.avatar,
                }}
              />
            }
            {
              editModal?.open &&
              <EditContactModal
                data={{
                  first_name: detailData?.first_name,
                  middle_name: detailData?.middle_name,
                  last_name: detailData?.last_name,
                  email: detailData?.email,
                  phone: detailData?.phone,
                  country: detailData?.country,
                  state: detailData?.state,
                  city: detailData?.city,
                  zip_code: detailData?.zip_code,
                  client_type: clientType.value,
                  note: detailData?.note,
                }}
                contactId={params.id}
                isPending={type === "pending"}
                onUpdate={() => refetch()}
                {...editModal}
              />
            }
            {
              shareModal?.open &&
              <ShareContactModal
                {...shareModal}
                contactId={params.id}
                isPending={type === "pending"}
              />
            }
            <CallStartModal 
              {...callStartModal} 
              onConfirm={() =>  onStartCall({ participants: [+userId, detailData?.id] })} 
              participants={[detailData]} 
              userId={profile?.id} 
            />
          </>
        )}
      </AttorneyLayout>
    );
  };
