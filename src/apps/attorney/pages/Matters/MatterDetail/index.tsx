/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { RouteComponentProps, useParams, navigate, useLocation } from "@reach/router";
import { parse } from "query-string";
import {
  Select,
  Dropdown,
  Tab,
  IconButton,
  ScaleLoader,
  MatterStageSelect,
} from "components";
import { useInput, useModal } from "hooks";
import { FaEllipsisH } from "react-icons/fa";
import { AttorneyLayout } from "apps/attorney/layouts";
import {closeMatter, getMatterById, openMatter, updateMatter} from "api";
import {
  NewMatterNoteModal,
  NewMessageModal,
  AddBillingItemModal,
  InvoiceModal,
  ReferMatterModal,
  DeleteMatterModal,
  NewMatterModal,
  ShareWithModal,
  LeaveMatterModal,
  CallParticipantsModal,
  CallStartModal
} from "modals";
import { useAuthContext, useChatContext } from "contexts";
import { getMatterStages } from "api";
import { getUserName, convertDBDate } from "helpers";
import { useQuery } from "react-query";
import Overview from "./Overview";
import Messages from "./Messages";
import Documents from "./Documents";
import Invoices from "./Invoices";
import Notes from "./Notes";
import Billing from "./Billing";
import "./style.scss";
const statusTypeData = [
  {
    title: "Open",
    id: "open",
  },
  {
    title: "Closed",
    id: "close",
  },
];
const referalStatusTypeData = [
  {
    title: "Open",
    id: "open",
  },
  {
    title: "Closed",
    id: "close",
  },
  {
    title: "Referral",
    id: "referral",
  },
];

const actionData = [
  {
    label: "Share with",
    action: "share",
  },
  {
    label: "Create a message",
    action: "message",
  },
  {
    label: "Create note",
    action: "note",
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
    label: "Refer matter",
    action: "refer",
  },
  {
    label: "Delete",
    action: "delete",
  },
];
const actionData3 = [
  {
    label: "Share with",
    action: "share",
  },
  {
    label: "Create a message",
    action: "message",
  },
  {
    label: "Create note",
    action: "note",
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
    label: "Delete",
    action: "delete",
  },
];
const actionData2 = [
  {
    label: "Create a message",
    action: "message",
  },
  {
    label: "Create note",
    action: "note",
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
    label: "Leave matter",
    action: "leave",
  },
];

export const MatterDetailPage: React.FunctionComponent<RouteComponentProps> =
  () => {
    const location = useLocation();

    const noteModal = useModal();
    const matterModal = useModal();
    const messageModal = useModal();
    const billingModal = useModal();
    const invoiceModal = useModal();
    const referModal = useModal();
    const deleteModal = useModal();
    const leaveModal = useModal();
    const shareModal = useModal();
    const callParticipants = useModal();

    const params = useParams();
    const stageType = useInput("");
    const statusType = useInput("");
    const [participants, setParticipants] = useState<any[]>([]);
    const { userId, userType, profile } = useAuthContext();
    const { onStartCall } = useChatContext();
    const callStartModal = useModal();

    const {
      isLoading: isMatterLoading,
      isError: isMatterError,
      error: matterError,
      data: matterData,
      refetch: matterRefetch,
    } = useQuery<any, Error>(
      ["matter-overview", params.id],
      () => getMatterById(params.id),
      {
        keepPreviousData: true,
      }
    );
    if (isMatterError){
      navigate(`/${userType}/matters/`);
    }

    const { data: matterStageData, refetch: refetchStages } = useQuery<
      { results: { id: string; title: string }[]; count: number },
      Error
    >(["matters-stages"], () => getMatterStages(params.id), {
      keepPreviousData: true,
    });

    const tabData = [
      {
        tab: "overview",
      },
      {
        tab: "messages",
        badge: matterData?.unread_comment_count || 0,
      },
      {
        tab: "documents",
      },
      {
        tab: "notes",
      },
      {
        tab: "billing items",
      },
      {
        tab: "invoices",
      },
    ];

    const tab = parse(location.search)?.tab || tabData[0].tab;
    const currentTab = useInput(tab.toString().replace('_', ' '));

    useEffect(() => {
      if (matterData) {
        stageType.onChange(matterData?.stage);
        statusType.onChange(matterData?.status);
      }
      return () => {};
    }, [matterData]);

    useEffect(() => {
      const tab = parse(location.search)?.tab || tabData[0].tab;
      currentTab.onChange(
        tab.toString().replace('_', ' ')
      )
    }, [location.search])

    /**
     * arg can be: status, stage
     * @param arg
     */
    const handleUpdateMatter = async (arg) => {
      await updateMatter(params.id, {
        ...arg
      });
    };


    const handleChangeMatterStatus =  async (param) => {
      if(param === "open") {
        await openMatter(matterData?.id);
      } else {
        await closeMatter(matterData?.id);
      }
      matterRefetch()
    }

    const handleActionClick = (params) => {
      switch (params) {
        case "share":
          shareModal.setOpen(true);
          break;
        case "message":
          messageModal.setOpen(true);
          break;
        case "note":
          noteModal.setOpen(true);
          break;
        case "bill":
          billingModal.setOpen(true);
          break;
        case "invoice":
          invoiceModal.setOpen(true);
          break;
        case "refer":
          referModal.setOpen(true);
          break;
        case "delete":
          deleteModal.setOpen(true);
          break;
        case "leave":
          leaveModal.setOpen(true);
          break;
        default:
          break;
      }
    };
    
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

    const handleEditMatter = () => {
      matterModal.setOpen(true);
    };

    /**
     * Filter out actions allowed only to attorney/enterprise type users
     */
    const filterActions = (menu: {
      label: string;
      action: string;
    }[]) => {
      const attorneyOnlyActions = [
        'share',
        'delete'
      ]; 
      return userType && ['paralegal', 'other'].indexOf(userType) !== -1
        ? menu.filter(item => attorneyOnlyActions.indexOf(item.action) === -1) 
        : menu;
    }

    return (
      <AttorneyLayout 
        title="Back to Matters" 
        backUrl={`/${userType}/matters`}
        userType={userType}
      >
        <div className="matter-detail-page__bar">
          {isMatterLoading ? (
            <ScaleLoader className="m-auto" />
          ) : isMatterError ? (
            <div className="my-auto">{matterError}</div>
          ) : (
            <>
              <span className="my-auto heading">{matterData?.title}</span>
              <div className="d-flex">
                <Select
                  data={
                    statusType.value === "referral"
                      ? referalStatusTypeData
                      : statusTypeData
                  }
                  onSelect={(status) => handleChangeMatterStatus(status)}
                  {...statusType}
                />
                <MatterStageSelect
                  {...stageType}
                  data={matterStageData?.results || []}
                  className="ml-3"
                  onUpdate={() => refetchStages()}
                  onSelect={(stage) => handleUpdateMatter({stage})}
                  stage={matterData?.stage_data}
                />
                {!matterData?.is_shared && (
                  <IconButton
                    type="edit"
                    className="ml-4 my-auto"
                    toolTip="Edit"
                    onClick={handleEditMatter}
                  />
                )}
                <IconButton
                  type="call"
                  className="ml-4 my-auto"
                  toolTip="Call"
                  onClick={handleCallClick}
                />
                <Dropdown
                  data={
                    !matterData?.is_shared
                      ? filterActions(actionData)
                      : +userId === +matterData?.attorney
                      ? actionData3
                      : filterActions(actionData2)
                  }
                  onActionClick={handleActionClick}
                  className="ml-4 mr-1"
                >
                  <FaEllipsisH className="matters-action-button" />
                </Dropdown>
              </div>
            </>
          )}
        </div>
        <Tab 
          data={tabData} 
          value={currentTab.value}
          onChange={value => navigate(`${location.pathname}?tab=${value}`)}
          className="capitalize" 
        />
        <div className="matter-detail-page__content d-flex flex-column flex-1">
          {currentTab.value === tabData[0].tab ? (
            <Overview
              isLoading={isMatterLoading}
              matterData={matterData}
              isMatterError={isMatterError}
              matterError={matterError}
              onUpdate={() => matterRefetch()}
            />
          ) : currentTab.value === tabData[1].tab ? (
            <Messages
              matterData={matterData}
              onUpdate={() => matterRefetch()}
            />
          ) : currentTab.value === tabData[2].tab ? (
            <Documents matterData={matterData} />
          ) : currentTab.value === tabData[3].tab ? (
            <Notes />
          ) : currentTab.value === tabData[4].tab ? (
            <Billing matterData={matterData} />
          ) : currentTab.value === tabData[5].tab ? (
            <Invoices matterData={matterData} />
          ) : null}
        </div>
        {matterData && (
          <>
            {
              noteModal?.open &&
              <NewMatterNoteModal {...noteModal} matter={params?.id} />
            }
            {
              messageModal?.open &&
              <NewMessageModal
                {...messageModal}
                matter={params?.id}
                data={matterData}   
              />
            }
            {
              billingModal?.open &&
              <AddBillingItemModal
                {...billingModal}
                matter={params?.id}
                client={matterData?.client}
                onCreate={() => matterRefetch()}
              />
            }
            {
              invoiceModal?.open &&
              <InvoiceModal
                {...invoiceModal}
                matter={params?.id}
                client={matterData?.client}
              />
            }
            {
              deleteModal?.open &&
              <DeleteMatterModal
                {...deleteModal}
                matter={matterData?.id}
                onOk={() => navigate(`/${userType}/matters`)}
              />
            }
            {
              leaveModal?.open && 
              <LeaveMatterModal
                {...leaveModal}
                matter={matterData?.id}
                onOk={() => navigate(`/${userType}/matters`)}
              />
            }
            {
              referModal?.open &&
              <ReferMatterModal 
                {...referModal} 
                matterData={matterData} 
                onAdd={() => matterRefetch()}
              />
            }
            {
              matterModal?.open &&
              <NewMatterModal
                {...matterModal}
                data={{
                  client: matterData?.client,
                  title: matterData?.title,
                  description: matterData?.description,
                  start_date: convertDBDate(matterData?.start_date),
                  stage: matterData?.stage,
                  speciality: matterData?.speciality,
                  country: matterData?.country,
                  state: matterData?.state,
                  city: matterData?.city_data?.id,
                  currency: matterData?.currency,
                  is_billable: true,
                  fee_type: matterData?.fee_type,
                  rate: matterData?.rate,
                  shared_with: matterData?.shared_with,
                  attachment: matterData?.attachment,
                  fee_note: matterData?.fee_note,
                }}
                matterId={matterData?.id}
                clientData={{
                  ...matterData?.client_data,
                  name: getUserName(matterData?.client_data),
                }}
                onCreate={() => matterRefetch()}
              />
            }
            {
              shareModal?.open &&
              <ShareWithModal
                {...shareModal}
                matter={params.id}
                onUpdate={() => matterRefetch()}
              />
            }
            {
              callParticipants?.open &&
              <CallParticipantsModal
                {...callParticipants}
                allParticipants={participants}
                onCreate={userIds => onStartCall({ participants: participants.map((p) => p.id) }, userIds)}
              />
            }
            <CallStartModal 
              {...callStartModal} 
              onConfirm={() =>  onStartCall({ participants: participants.map((p) => p.id) })} 
              participants={participants} 
              userId={profile?.id} 
            />
          </>
        )}
      </AttorneyLayout>
    );
  };
