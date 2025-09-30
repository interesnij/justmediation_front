import React, { useEffect } from "react";
import { AttorneyLayout } from "apps/attorney/layouts";
import { RouteComponentProps } from "@reach/router";
import "./style.scss";

interface Props extends RouteComponentProps {
  children: React.ReactNode;
  userType: string;
}

export const ChatLayout = ({ children, userType }: Props) => {
  useEffect(() => {
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AttorneyLayout title="Chats" userType={userType}>
      <div className="chat-page">{children}</div>
    </AttorneyLayout>
  );
};
