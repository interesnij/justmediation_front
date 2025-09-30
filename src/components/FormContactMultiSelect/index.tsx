import React, { useRef, useState } from "react";
import classNames from "classnames";
import { User } from "components";
import { useOnClickOutside, useModal } from "hooks";
import { useField, FieldHookConfig } from "formik";
import ArrowIcon from "assets/icons/arrow-drop-down.svg";
import CloseIcon from "assets/icons/close.svg";
import ClipLoader from "react-spinners/ClipLoader";
import { AlertModal } from "modals";
import { css } from "@emotion/react";

import "./style.scss";
type Props = FieldHookConfig<any[]> & {
  values?: {
    id: any;
    name: string;
    email: string;
    avatar?: string;
    type?: string;
  }[];
  showAvatar?: boolean;
  label?: string;
  className?: string;
  placeholder?: string;
  help?: string;
  isRequired?: boolean;
  isLoading?: boolean;
  isMultiSelect?: boolean;
  disabled?: boolean;
  value?: any;
  validateOnChange?(item: any): boolean;
};
export const FormContactMultiSelect: React.FC<Props> = ({
  label,
  className,
  help,
  values = [],
  placeholder,
  showAvatar = true,
  isLoading = false,
  disabled = false,
  isRequired,
  validateOnChange,
  ...props
}) => {
  const actionRef = useRef<HTMLDivElement>(null);
  const [field, meta, helpers] = useField(props);
  const [showMenu, setShowMenu] = useState(false);
  const alertModal = useModal(false);
  const [alertMessage, setAlertMessage] = useState(
    "You can add a maximum of ONE client user in a chat."
  )
  useOnClickOutside(actionRef, () => setShowMenu(false));

  const handleChange = (item: any, event?: React.MouseEvent) => {
    if (validateOnChange && !validateOnChange(item)) {
      alertModal.setOpen(true);
      return;
    }
    if (!disabled) {
      event && event.preventDefault();
      event && event.stopPropagation();
      actionRef.current && actionRef.current.blur();
      helpers.setValue(
        field.value.includes(item?.id)
          ? field.value.filter((d) => d !== item?.id)
          : [...field.value, item?.id]
      );
      setShowMenu(false);
    }
  };

  const handleClick = () => {
    setShowMenu((show) => !disabled && !show);
  };

  return (
    <>
      <div
        className={classNames(className, {
          error: meta.touched && meta.error,
        })}
      >
        <div className="d-flex justify-content-between">
          <div className="contact-multi-select-control__label">{label}</div>
          {!isRequired && (
            <div className="contact-multi-select-control__required">Optional</div>
          )}
        </div>
        <div
          className={classNames("contact-multi-select-control__container search_container")}
          ref={actionRef}
        >
          <div
            className={classNames("contact-multi-select-control", {
              active: field.value && field.value.length,
              error: meta.touched && meta.error,
            })}
            onClick={handleClick}
          >
            <div className="flex-1 d-flex flex-wrap">
              {field.value && field.value.length ? (
                field.value.map((id) => {
                  const item = values.find((d) => d.id === id);
                  return (
                    <div
                      key={id}
                      className="contact-multi-select-control__item"
                    >
                      {showAvatar && (
                        <User
                          avatar={item?.avatar}
                          size="small"
                          className="my-auto mr-1"
                        />
                      )}
                      <span className="my-auto">
                        {item?.name}
                      </span>
                      <img
                        src={CloseIcon}
                        alt="close"
                        className="contact-multi-select-control__item-close"
                        onClick={(event) => handleChange(item, event)}
                      />
                    </div>
                  );
                })
              ) : (
                <span className="my-auto">{placeholder}</span>
              )}
            </div>
            <img
              src={ArrowIcon}
              className="contact-multi-select-control__arrow"
              alt="arrow"
            />
          </div>
          <div
            className={classNames("contact-multi-select-control__menu", {
              active: showMenu,
            })}
          >
            {isLoading ? (
              <ClipLoader
                size={40}
                color="rgba(0,0,0,.6)"
                css={css`
                  display: block;
                  margin: 20px auto;
                `}
              />
            ) : values.length === 0 ? (
              <div className="my-3 text-center text-gray">No results</div>
            ) : (
              values.map(item => {
                return (
                  <div
                    className={classNames(
                      "contact-multi-select-control__menu-item",
                      {
                        active: field.value && field.value.includes(item?.id),
                      }
                    )}
                    onClick={() => handleChange(item)}
                    key={item?.id}
                  >
                    {showAvatar && (
                      <User
                        avatar={item?.avatar}
                        size="small"
                        className="my-auto mr-1"
                      />
                    )}
                    <div className="d-flex flex-column">
                      <div className="contact-multi-select-control__menu-item-name">
                        {item?.name}
                      </div>
                      <div className="contact-multi-select-control__menu-item-email">
                        {item?.email}
                      </div>
                    </div>
                    <div className="ml-auto my-auto contact-multi-select-control__menu-item-type">
                      {item?.type}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div className="contact-multi-select-control__footer">
          {meta.touched && meta.error && (
            <div className="contact-multi-select-control__validation">
              {meta.error}
            </div>
          )}
          {help && (
            <div className="contact-multi-select-control__help ml-auto">
              {help}
            </div>
          )}
        </div>
      </div>
      <AlertModal {...alertModal} message={alertMessage} />
    </>
  );
};
