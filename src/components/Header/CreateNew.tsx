import React, { useRef } from "react";
import classNames from "classnames";
import {
  AddTimeEntry,
  AddExpenseEntry,
  NewNoteModal,
  NewDocumentModal,
  NewMatterModal,
  NewContactModal,
} from "modals";
import { useModal } from "hooks";
import { useAuthContext } from "contexts";
import { remove } from "lodash";
import PlusIcon from "assets/icons/plus_black.svg";
import "./style.scss";

let menuData = [
  {
    title: "Time entry",
    id: "time",
  },
  {
    title: "Expense entry",
    id: "expense",
  },
  {
    title: "Matter",
    id: "matter",
  },
  {
    title: "Contact",
    id: "contact",
  },
  {
    title: "Document",
    id: "document",
  },
  {
    title: "Template",
    id: "template",
  },
  {
    title: "Note",
    id: "note",
  },
];

interface Props {
  className?: string;
  disabled?: boolean;
}

export default function CreateNew({ className, disabled }: Props) {
  const { userType } = useAuthContext();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const addTimeModal = useModal();
  const addExpenseModal = useModal();
  const newNoteModal = useModal();
  const newDocumentModal = useModal();
  const newTemplateModal = useModal();
  const newMatterModal = useModal();
  const newContactModal = useModal();

  if (userType === 'paralegal'){
    menuData = remove(menuData, (n) =>{ return n.id !== 'matter' });
  }
  const handleClick = (params) => {
    containerRef.current && containerRef.current.blur();
    switch (params) {
      case "time":
        addTimeModal.setOpen(true);
        break;
      case "expense":
        addExpenseModal.setOpen(true);
        break;
      case "note":
        newNoteModal.setOpen(true);
        break;
      case "document":
        newDocumentModal.setOpen(true);
        break;
      case "template":
        newTemplateModal.setOpen(true);
        break;
      case "matter":
        newMatterModal.setOpen(true);
        break;
      case "contact":
        newContactModal.setOpen(true);
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className={classNames("header-create", disabled ? "disabled" : "", className)}
    >
      <div className="menu-button">
        <img src={PlusIcon} className="menu-button__icon" alt="plus" />
        <span>Create New</span>
      </div>
      <div className="menu-dropdown">
        {menuData.map(({ title, id }) => {
          return (
            <div className="menu-item" onClick={() => handleClick(id)} key={id}>
              {title}
            </div>
          );
        })}
      </div>
      {
        addTimeModal?.open &&
        <AddTimeEntry {...addTimeModal} />
      }
      {
        addExpenseModal?.open &&
        <AddExpenseEntry {...addExpenseModal} />
      }
      {
        newNoteModal?.open &&
        <NewNoteModal {...newNoteModal} />
      }
      {
        newDocumentModal?.open &&
        <NewDocumentModal {...newDocumentModal} />
      }
      {
        newTemplateModal?.open &&
        <NewDocumentModal {...newTemplateModal} isTemplate />
      }
      {
        newMatterModal?.open &&
        <NewMatterModal {...newMatterModal} />
      }
      {
        newContactModal?.open &&
        <NewContactModal {...newContactModal} />
      }
    </div>
  );
}
