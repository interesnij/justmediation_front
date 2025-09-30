import React from "react";
import { Tab, FullScreenModal } from "components";
import { useInput } from "hooks";
import { Profile } from "./Profile";
import { MyEvents } from "./MyEvents";
import "./style.scss";

interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  userType: string;
}
export const ProfileModal = ({ open, setOpen, userType }: Props) => {
  
  const getTabData = () => {
    const menu = [{ tab: "Profile Information" }]
    // add only attorney tabs
    if (['enterprise', 'attorney'].indexOf(userType) !== -1) {
      menu.push({ tab: "My Events" })
    }
    return menu;
  }
  
  const tabData = getTabData();
  
  const currentTab = useInput(tabData[0].tab);
  let reset = () => {};

  const handleCancel = () => {
    setOpen(false);
    reset();
  }

  return (
    <FullScreenModal
      title="Edit Profile"
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <Tab data={tabData} {...currentTab} />
      <div className="d-flex flex-column flex-1 overflow-auto">
        {currentTab.value === tabData[0].tab ?
          <Profile handleCancel={handleCancel} /> :
          <MyEvents handleCancel={handleCancel} />}
      </div>
    </FullScreenModal>
  );
};
