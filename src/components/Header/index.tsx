import React from "react";
import {
  ProfileDropDown,
  Notification,
  ClientProfileDropDown,
} from "components";
import { Link } from "@reach/router";
import { useModal } from "hooks";
import { NotificationModal } from "modals";
import { useAuthContext, useContextSubscriptionAccess } from "contexts";
import CreateNew from "./CreateNew";
import StartTimer from "./StartTimer";
import { getNotifications } from "api";
import { useQuery } from "react-query";
import ArrowIcon from "assets/icons/arrow_left_white.svg";
import "./style.scss";
interface Props {
  title?: string;
  backUrl?: string;
  showButtons?: boolean;
  onTimerStop?(): void;
}
export const Header = ({
  title,
  backUrl,
  showButtons = true,
  onTimerStop = () => {},
}: Props) => {
  const notificationModal = useModal();
  const { avatar, userType } = useAuthContext();
  const { hasSubscription } = useContextSubscriptionAccess();
  const { isLoading, isError, error, data } = useQuery<
    { results: any[]; count: number; unread_count: number },
    Error
  >(["notification"], () => getNotifications(), {
    keepPreviousData: true,
    enabled: true,
  });

  const handleNotificationClick = () => {
    notificationModal.setOpen(true);
  };

  return (
    <div className="header">
      <div className="header__left">
        {title && !backUrl && (
          <span className="my-auto header__title">{title}</span>
        )}
        {title && backUrl && (
          <Link to={backUrl} className="header__nav my-auto">
            <img src={ArrowIcon} alt="arrow" />
            <span>{title}</span>
          </Link>
        )}
      </div>
      <div className="header__right">
        {showButtons && (
          <>
            <StartTimer disabled={!hasSubscription} className="my-auto" onTimerStop={onTimerStop} />
            <CreateNew disabled={!hasSubscription} className="ml-3 my-auto" />
          </>
        )}
        <Notification
          className="ml-3"
          badgeCount={data?.unread_count}
          onClick={handleNotificationClick}
        />
        {userType === "client" ? (
          <ClientProfileDropDown avatar={avatar} />
        ) : (
          <ProfileDropDown avatar={avatar} />
        )}
      </div>
      {
        notificationModal?.open &&
        <NotificationModal
          {...notificationModal}
          isLoading={isLoading}
          data={data?.results}
          isError={isError}
          error={error}
        />
      }
    </div>
  );
};
