import React from "react";
import { SideModal, User, Button } from "components";
import "./style.scss";

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  data?: any;
  onView?(userId: number): void;
  onCall?(userId: number): void;
  onChat?(userId: number): void;
  onCreateMatter?(): void;
  createMatter?: boolean;
}
export const ProfileSideModal = ({
  open,
  setOpen,
  data,
  onView = () => {},
  onCall = () => {},
  onChat = () => {},
  onCreateMatter = () => {},
  createMatter = false,
}: Props) => {
  // backend sends address as array
  if (Array.isArray(data?.address)){
    data.address = data.address[0];
  }
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
      <div className="address-column">
        <span>{line1}</span>
        <span>{line2}</span>
      </div>
    )
  }
  return (
    <SideModal size="small" title="Detail" open={open} setOpen={setOpen}>
      <User size="large" avatar={data?.avatar} className="mx-auto mt-4" />
      <div className="d-flex mt-2">
        <div className="text-gray chat-message-user-detail__label">PHONE</div>
        <div className="text-black">{data?.phone}</div>
      </div>
      <div className="d-flex mt-2">
        <div className="text-gray chat-message-user-detail__label">EMAIL</div>
        <div className="text-black">{data?.email}</div>
      </div>
      <div className="d-flex mt-2">
        <div className="text-gray chat-message-user-detail__label">ADDRESS</div>
        <div className="text-black">{renderAddress(data?.address)}</div>
      </div>
      {/*
      <div className="d-flex mt-4">
        <Button type="outline" size="large" onClick={e => onView(data?.id)}>
          View Contact
        </Button>
        <Button type="outline" size="large" className="ml-2" onClick={onCall}>
          Call
        </Button>
        <Button type="outline" size="large" className="ml-2" onClick={onChat}>
          Chat
        </Button>
      </div>
      */}
      {createMatter && (
        <div className="d-flex justify-content-center mt-4">
          <Button size="large" onClick={onCreateMatter}>
            Create Matter
          </Button>
        </div>
      )}
    </SideModal>
  );
};
