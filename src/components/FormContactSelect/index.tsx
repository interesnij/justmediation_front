import React, { useRef, useState } from "react";
import classNames from "classnames";
import { User } from "components";
import { useOnClickOutside } from "hooks";
import { useField, FieldHookConfig } from "formik";
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/react";
import ArrowIcon from "assets/icons/arrow-drop-down.svg";
import CloseIcon from "assets/icons/close.svg";
import { getUserName } from "helpers";
import "./style.scss";

type Props = FieldHookConfig<any> & {
  values?: any[];
  showAvatar?: boolean;
  label?: string;
  className?: string;
  placeholder?: string;
  help?: string;
  isRequired?: boolean;
  isLoading?: boolean;
  isMultiSelect?: boolean;
  disabled?: boolean;
};
export const FormContactSelect: React.FC<Props> = ({
  label,
  className,
  help,
  values = [],
  placeholder,
  showAvatar = true,
  isLoading = false,
  disabled = false,
  isRequired,
  ...props
}) => {
  const actionRef = useRef<HTMLDivElement>(null);
  const [field, meta, helpers] = useField(props);
  const [showMenu, setShowMenu] = useState(false);
  useOnClickOutside(actionRef, () => setShowMenu(false));

  const handleChange = (param: any, event?: React.MouseEvent) => {
    if (disabled) return;
    event && event.preventDefault();
    event && event.stopPropagation();
    actionRef.current && actionRef.current.blur();
    if (field.value === param) {
      helpers.setValue("");
    } else {
      helpers.setValue(param);
    }
    setShowMenu(false);
  };

  const handleClick = () => {
    setShowMenu((show) => !disabled && !show);
  };

  return (
    <div
      className={classNames(className, {
        error: meta.touched && meta.error,
      })}
    >
      <div className="d-flex justify-content-between">
        <div className="contact-select-control__label">{label}</div>
        {!isRequired && (
          <div className="contact-select-control__required">Optional</div>
        )}
      </div>
      <div
        className={classNames("contact-select-control__container search_container")}
        ref={actionRef}
      >
        <div
          className={classNames("contact-select-control", {
            active: field.value,
            error: meta.touched && meta.error,
          })}
          onClick={handleClick}
        >
          <div className="flex-1 d-flex flex-wrap">
            {field.value ? (
              <div className="contact-select-control__item">
                {showAvatar && (
                  <User
                    avatar={
                      values.find(
                        (d) => d.id.toString() === field.value.toString()
                      )?.avatar
                    }
                    size="small"
                    className="my-auto mr-1"
                  />
                )}
                <span className="my-auto">
                  {getUserName(
                    values.find(
                      (d) => d.id.toString() === field.value.toString()
                    )
                  )}
                </span>
                <img
                  src={CloseIcon}
                  alt="close"
                  className="contact-select-control__item-close"
                  onClick={(event) => handleChange(field.value, event)}
                />
              </div>
            ) : (
              <span className="my-auto">{placeholder}</span>
            )}
          </div>
          <img
            src={ArrowIcon}
            className="contact-select-control__arrow"
            alt="arrow"
          />
        </div>
        <div
          className={classNames("contact-select-control__menu", {
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
            values.map(({ name, email, id: itemVal, avatar, type, first_name, last_name, middle_name }) => {
              return (
                <div
                  className={classNames("contact-select-control__menu-item", {
                    active: +field.value === +itemVal,
                  })}
                  onClick={() => handleChange(itemVal)}
                  key={itemVal}
                >
                  {showAvatar && (
                    <User
                      avatar={avatar}
                      size="small"
                      className="my-auto mr-1"
                    />
                  )}
                  <div className="d-flex flex-column">
                    <div className="contact-select-control__menu-item-name">
                      {Boolean(name) ? name : `${first_name || ""} ${middle_name || ""} ${last_name || ""}`}
                    </div>
                    <div className="contact-select-control__menu-item-email">
                      {email}
                    </div>
                  </div>
                  <div className="ml-auto my-auto contact-select-control__menu-item-type">
                    {type}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="contact-select-control__footer">
        {meta.touched && meta.error && (
          <div className="contact-select-control__validation">{meta.error}</div>
        )}
        {help && (
          <div className="contact-select-control__help ml-auto">{help}</div>
        )}
      </div>
    </div>
  );
};
