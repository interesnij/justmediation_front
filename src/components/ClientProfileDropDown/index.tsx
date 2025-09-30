import React, {useRef, useState} from "react";
import { navigate } from "@reach/router";
import { FaUser } from "react-icons/fa";
import { useAuthContext } from "contexts/Auth";
import { MyVaultModal } from "modals";
import DropDownIco from "assets/icons/profile_dropdown.svg";
import { useLocation } from "@reach/router"
import {useModal, useOnClickOutside} from "hooks";
import "./style.scss";

const menuData = [
  {
    title: "Account Settings",
    id: "settings",
  },
  {
    title: "My Vault",
    id: "vault",
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
];

interface Props {
  avatar?: string;
}

export const ClientProfileDropDown = ({ avatar }: Props) => {
  const divRef = useRef(null);
  const { logout } = useAuthContext();
  const location = useLocation();
  const myVaultModal = useModal();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [toggle, setToggle] = useState<boolean>(false);
  useOnClickOutside(divRef, () => setToggle(false));

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleAction = (param: string): void => {
    dropdownRef.current?.blur();
    switch (param) {
      case "settings":
        navigate("/client/settings");
        break;
      case "terms":
        window.open(`${location.origin}/terms-of-use`);
        break;
      case "policy":
        window.open(`${location.origin}/privacy-policy`);
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
        {avatar ? (
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
        myVaultModal?.open &&
        <MyVaultModal {...myVaultModal} />
      }
    </div>
  );
};
