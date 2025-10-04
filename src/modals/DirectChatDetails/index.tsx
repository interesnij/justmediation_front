/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { SideModal, User, Button } from "components";
import { useAuthContext } from "contexts";
import { navigate } from "@reach/router";
import { formatPhoneNumber } from "helpers";
import { NewChatModal } from "modals";
import { useModal } from "hooks";
import { uuid4 as uuid } from "@sentry/utils";
import "./index.scss";

interface Props {
  open: boolean;
  data?: any;
  Opponent?: any;
  setOpen(param: boolean): void;
  onCreate?(params: string): void;
  onCall?(): void;
}
export const DirectChatDetailModal = ({
  open,
  setOpen,
  data,
  Opponent,
  onCreate = () => {},
  onCall = () => {}
}: Props) => {  
  const { userId, userType } = useAuthContext();
  const [opponent, setOpponent] = useState<any>(null);
  const chatModal = useModal();
  useEffect(() => {
    if (!data?.participants_data?.length) 
        return setOpponent(null);
    const currentOpponent = data.participants_data
        .find(p => p.id !== +userId);
    if (currentOpponent) setOpponent(currentOpponent);
  }, [data]);

  useEffect(() => {
    if (Opponent) setOpponent(Opponent);
  }, [Opponent]);

  const handleProfileView = () => {
    if (userType === 'client'){
      navigate(`/client/find/mediators/${opponent.id}`);
      return;
    }
    if (!opponent?.user_type) return;
    switch (opponent.user_type) {
      case 'mediator':
        navigate(`/${opponent.user_type}/contacts/${opponent.id}`); break;
      case 'paralegal':
      case 'other':
      case 'enterprise':
        navigate(`/${opponent.user_type}/contacts/${opponent.id}`); break;
      case 'client':
        navigate(`/${userType}/leads/${opponent.id}?type=client`); break;
      default:
        navigate(`/${userType}/leads/`);
    }
  }

  const handleCreate = (link: string) => {
    chatModal.setOpen(false)
    onCreate(link);
  };

  const renderAddress = (address) => {
    const line1 = [
      address?.address1, 
      address?.address2
    ].join(' ');
    const line2 = [
      address?.city ? address?.city + ',' : '',
      address?.state,
      address?.zip_code + ', ',
      address?.country,
    ].join(' ');
    return (
      <div className="address-column item-value">
        <span>{line1}</span>
        <span>{line2}</span>
      </div>
    )
  }

  return (
    <>
      <SideModal size="small" title="Profile" open={open} setOpen={setOpen}>
        <div className="direct-chat-details">
          <div className="direct-chat-details-header mb-1">
            <User
              size={"large"}
              avatar={opponent?.avatar}
            />
            <div className="mt-2 user-name">{opponent?.first_name} {opponent?.last_name}</div>
            <div className="user-type-label mt-2">{opponent?.user_type}</div>
          </div>
          {
            userType !== 'client' && opponent?.user_type === 'client' &&
            <div className="mb-3">
              <div className="mb-2">
                <span className="item-label mr-1">PHONE</span>
                <span className="item-value">{opponent?.phone ? (formatPhoneNumber(opponent.phone) || opponent.phone) : "-"}</span>
              </div>
              <div className="mb-2">
                <span className="item-label mr-1">EMAIL</span>
                <span className="item-value">{opponent?.email}</span>
              </div>
              <div className="mb-2">
                <span className="item-label mr-1">ADDRESS</span>
                {renderAddress(opponent?.address)}
              </div>
            </div>
          }
        </div>
        <div className="direct-chat-details-footer">
          <Button className="mb-1" type="outline" onClick={handleProfileView}>
            View profile
          </Button>
          {userType !== 'client' && (
            <Button className="mb-1" type="outline" onClick={e => chatModal.setOpen(true)}>
              Group Chat
            </Button>
          )}
          {/*
          <Button className="mb-1" type="outline" onClick={onCall}>
            Call
          </Button>
          */}
        </div>
      </SideModal>
      {opponent?.id && (
        <NewChatModal {...chatModal} onCreate={handleCreate} initialValue={[opponent.id]} />
      )}
    </>
  );
};