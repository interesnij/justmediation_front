import React, { useRef, useState } from "react";
import classNames from "classnames";
import { User } from "components";
import { useOnClickOutside } from "hooks";
import { useField, FieldHookConfig } from "formik";
import ArrowIcon from "assets/icons/arrow-drop-down.svg";
import CloseIcon from "assets/icons/close.svg";
import "./style.scss";
type Props = FieldHookConfig<any[]> & {
  values?: {
    title: string;
    id: any;
    avatar?: string;
  }[];
  showAvatar?: boolean;
  label?: string;
  className?: string;
  placeholder?: string;
  help?: string;
  isRequired?: boolean;
};
export const FormMultiSelect: React.FC<Props> = ({
  label,
  className,
  help,
  values = [],
  placeholder,
  showAvatar = false,
  isRequired,
  ...props
}) => {
  const actionRef = useRef<HTMLDivElement>(null);
  const [field, meta, helpers] = useField(props);
  const [showMenu, setShowMenu] = useState(false);
  useOnClickOutside(actionRef, () => setShowMenu(false));

  const handleChange = (param, event?: React.MouseEvent) => {
    event && event.preventDefault();
    event && event.stopPropagation();
    actionRef.current && actionRef.current.blur();
    helpers.setValue(
      field.value.includes(param)
        ? field.value.filter((d) => d !== param)
        : [...field.value, param]
    );
    setShowMenu(false);
  };

  const handleClick = () => {
    setShowMenu((show) => !show);
  };

  return (
    <div className={className}>
      <div className="d-flex justify-content-between">
        <div className="multi-select-control__label">{label}</div>
        {!isRequired && (
          <div className="multi-select-control__required">Optional</div>
        )}
      </div>
      <div
        className={classNames("multi-select-control__container search_container")}
        ref={actionRef}
      >
        <div
          className={classNames("multi-select-control", {
            active: field.value && field.value.length,
          })}
          onClick={handleClick}
        >
          <div className="flex-1 d-flex flex-wrap">
            {field.value && field.value.length ? (
              field.value.map((item) => {
                return (
                  <div key={item} className="multi-select-control__item">
                    {showAvatar && (
                      <User
                        avatar={values.find((d) => d.id === item)?.avatar}
                        size="small"
                        className="my-auto mr-1"
                      />
                    )}
                    <span className="my-auto">
                      {values.find((d) => d.id === item)?.title}
                    </span>
                    <img
                      src={CloseIcon}
                      alt="close"
                      className="multi-select-control__item-close"
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
            className="multi-select-control__arrow"
            alt="arrow"
          />
        </div>
        <div
          className={classNames("multi-select-control__menu", {
            active: showMenu,
          })}
        >
          {values.map(({ title, id: itemVal, avatar }) => {
            return (
              <div
                className={classNames("multi-select-control__menu-item", {
                  active: field.value && field.value.includes(itemVal),
                })}
                onClick={() => handleChange(itemVal)}
                key={itemVal}
              >
                {showAvatar && (
                  <User avatar={avatar} size="small" className="my-auto mr-1" />
                )}
                <span>{title}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="multi-select-control__footer">
        {meta.touched && meta.error && (
          <div className="multi-select-control__validation">{meta.error}</div>
        )}
        {help && (
          <div className="multi-select-control__help ml-auto">{help}</div>
        )}
      </div>
    </div>
  );
};
