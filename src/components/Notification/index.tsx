import React from "react";
import NotificationIco from "assets/icons/notification.svg";
import classNames from "classnames";
import { Badge } from "components";
import "./style.scss";
interface Props {
  className?: string /** custom class name */;
  onClick?(): void;
  badgeCount?: number;
}
export const Notification = ({
  onClick = () => {},
  badgeCount = 0,
  className,
}: Props) => {
  return (
    <>
      <Badge className="my-auto" count={badgeCount}>
        <div
          className={classNames("notification", className)}
          onClick={() => onClick()}
        >
          <img src={NotificationIco} alt="notification" />
        </div>
      </Badge>
    </>
  );
};
