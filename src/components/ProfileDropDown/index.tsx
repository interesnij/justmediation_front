import React, {useRef, useState} from "react";
import { navigate } from "@reach/router";
import { FaUser } from "react-icons/fa";
import { useModal } from "hooks";
import { ProfileModal, SettingsModal, MyVaultModal } from "modals";
import { useAuthContext } from "contexts/Auth";
import DropDownIco from "assets/icons/profile_dropdown.svg";
import {useOnClickOutside} from 'hooks/useOnClickOutside';
import "./style.scss";

const menuData = [
  {
    title: "Edit profile",
    id: "profile",
  },
  {
    title: "Settings",
    id: "settings",
  },
  {
    title: "Terms of Use",
    id: "terms",
  },
  {
    title: "Privacy Policy",
    id: "policy",
  },
  {
    title: "Help and support",
    id: "help",
  },
  {
    title: "My Vault",
    id: "vault",
  },
];

interface Props {
  avatar?: string;
}

export const ProfileDropDown = ({ avatar }: Props) => {
  const divRef = useRef(null);
  const profileModal = useModal();
  const settingsModal = useModal();
  const myVaultModal = useModal();
  const { logout, userType } = useAuthContext();
  const [toggle, setToggle] = useState<boolean>(false);
  useOnClickOutside(divRef, () => setToggle(false));

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleAction = (param) => {
    switch (param) {
      case "profile":
        profileModal.setOpen(true);
        break;
      case "settings":
        settingsModal.setOpen(true);
        break;
      case "terms":
        navigate("/terms-of-use");
        break;
      case "policy":
        navigate("/privacy-policy");
        break;
      case "help":
        break;
      case "vault":
        myVaultModal.setOpen(true);
        break;
      default:
        break;
    }
  };
  return (
    <div tabIndex={0} className={`profile-drop-down ${toggle ? 'show' : 'hide'}`} >
      <div ref={divRef} className="menu-button" onClick={() => setToggle(prevState => !prevState)}>
        {(avatar && avatar !== "[]") ? (
          <img src={avatar} className="avatar" alt="avatar" />
        ) : (
          <FaUser />
        )}
        <img src={DropDownIco} className="menu-button-icon" alt="drop-down" />
      </div>
      <div className="menu-dropdown">
        {menuData.map(({ title, id }) => {
          return (
            <div key={id} onClick={() => handleAction(id)} id={id === "help" ? 'intercom-btn' : id}>
              {title}
            </div>
          );
        })}
        <div className="logout" onClick={handleLogout}>
          Log out
        </div>
      </div>
      {
        profileModal?.open &&
        <ProfileModal {...profileModal} userType={userType} />
      }
      {
        settingsModal?.open &&
        <SettingsModal {...settingsModal} userType={userType} />
      }
      {
        myVaultModal?.open &&
        <MyVaultModal {...myVaultModal} />
      }
    </div>
  );
};
