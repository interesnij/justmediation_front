import React, { useEffect, useState } from "react";
import { SideModal, User, RiseLoader } from "components";
import { format } from "date-fns";
import { Link, useLocation } from "@reach/router";
import { useAuthContext, useChatContext } from "contexts";
import { markNotificationRead } from "api";
interface Props {
  isLoading: boolean;
  isError: boolean;
  error: any;
  open: boolean;
  setOpen(param: boolean): void;
  data?: any[];
}

interface IDisplayData {
  date: string;
  data: {
    text: string;
    date: string;
    avatar: string;
  }[];
}

export const NotificationModal = ({
  open,
  setOpen,
  isLoading,
  isError,
  error,
  data = [],
}: Props) => {
  const [updatedData, setUpdatedData] = useState<Array<IDisplayData>>([]);
  const { userType } = useAuthContext();
  const { resetStoppedCalls } = useChatContext();
  const location = useLocation();

  useEffect(() => {
    // const dateBy = groupBy(data, (item) =>
    //   format(new Date(item.date), "yyyy-MM-dd")
    // );
    // let newData: Array<IDisplayData> = [];
    // keys(dateBy).forEach((key) => {
    //   newData = [
    //     ...newData,
    //     {
    //       date: isToday(new Date(key))
    //         ? "Today"
    //         : isYesterday(new Date(key))
    //         ? "Yesterday"
    //         : format(new Date(key), "eee MM/dd/yy"),
    //       data: dateBy[key],
    //     },
    //   ];
    // });
    // setUpdatedData(newData);

    return () => {};
  }, [data]);
  const composeRoute = (type, id) => {
    switch (type) {
      // Business
      case "matter_status_update":
      case "new_matter_shared":
      case "new_matter_referred":
      case "matter_stage_update":
      case "new_referral_accepted":
      case "new_referral_declined":
        return userType === "client"
          ? `/client/overview/matter/${id}`
          : `/${userType}/matters/${id}`;
      case "new_proposal":
      case "proposal_withdrawn":
      case "proposal_accepted":
      case "post_deactivated":
      case "post_reactivated":
        return userType === "client"
          ? `/client/find/posts/${id}`
          : `/${userType}/engagement/submitted_post/${id}`;
      // Document
      case "document_shared_by_attorney":
      case "document_uploaded":
        return userType === "client"
          ? `/client/overview`
          : `/${userType}/documents`;
      // Forum
      case "new_post":
        return `/${userType}/forums/post/${id}`;
      case "new_attorney_post":
        return `/${userType}/forums/post/${id}`;
      case "new_post_on_topic":
        return `/${userType}/forums/post/${id}`;
      // Promotion
      case "new_attorney_event":
        return `/${userType}/overview`;
      // Social
      case "new_message":
        return userType === "client"
          ? `/client/overview/matter/${id}/messages`
          : `/${userType}/matters/${id}?tab=messages`;
      case "document_uploaded_to_matter":
        return userType === "client"
          ? `/client/overview/matter/${id}/documents`
          : `/${userType}/matters/${id}?tab=documents`;
      case "new_invoice":
        return `/client/overview/matter/${id}/invoices`;
      case "new_billing_item":
        return `/${userType}/matters/${id}?tab=billing_items`;
      case "new_opportunities":
      case "new_group_chat":
      case "new_chat":
      case "new_chat_message":
        return userType === "client"
          ? `/${userType}/chats/${id}`
          : `/${userType}/chats/?id=${id}`;
      case "new_video_call":
        resetStoppedCalls();
        return location.pathname + location.search; // no need to redirect
      case "new_registered_contact_shared":
        return `/${userType}/contacts`;
      case "new_unregistered_contact_shared":
        return `/${userType}/contacts`;
      default:
        return `/${userType}/overview`;
    }
  };

  const handleClick = async (id, status) => {
    if (status !== 'read')
      await markNotificationRead(id);
  };
  return (
    <SideModal title="Notification" open={open} setOpen={setOpen}>
      {isLoading ? (
        <div className="my-auto d-flex">
          <RiseLoader className="my-4" />
        </div>
      ) : isError ? (
        <div>Error: {error?.message}</div>
      ) : data && data?.length > 0 ? (
        data.map((section, index) => {
          // return (
          //   <div className="notification__item" key={`${index}key`}>
          //     <div className="notification__item-date">{ section?.created ? format(new Date(section?.created), 'MM/dd/yyyy hh:mm:ss a'): ''}</div>
          //     <div className="notification__item-data">
          //       {section.data.map((item, index) => {
          return (
            <div key={`${index}key`} className="notification__item-message">
              <User avatar={section?.sender_data?.avatar} />
              <div
                className={`notification__item-message-text my-auto ${
                  section?.status === "sent" || section?.status === "prepared"
                    ? "text-bold"
                    : ""
                }`}
              >
                <Link
                  to={composeRoute(
                    section?.notification?.runtime_tag,
                    section?.notification?.object_id
                  )}
                  onClick={() => handleClick(section?.id, section?.status)}
                >
                  {section?.notification?.content}
                </Link>
              </div>
              <div className="notification__item-message-date my-auto">
                {section?.modified
                  ? format(new Date(section?.modified), "MM/dd/yyyy hh:mm:ss a")
                  : ""}
              </div>
            </div>
          );
          //       })}
          //     </div>
          //   </div>
          // );
        })
      ) : (
        <div className="mt-4 text-center text-gray">No notifications</div>
      )}
    </SideModal>
  );
};
