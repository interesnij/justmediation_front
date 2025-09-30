import React, { useRef, useState, useEffect } from "react";
import classNames from "classnames";
import { User } from "components";
import { useOnClickOutside } from "hooks";
import { useField, FieldHookConfig } from "formik";
import CloseIcon from "assets/icons/close.svg";
import ClipLoader from "react-spinners/ClipLoader";
import { css } from "@emotion/react";

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
  registeredTeamMembers: { id: number, email:string }[];
  setRegisteredTeamMembers: (obj: any) => void;
};
export const FormMultiEmails: React.FC<Props> = ({
  label,
  className,
  help,
  values = [],
  placeholder,
  showAvatar = true,
  isLoading = false,
  disabled = false,
  isRequired,
  registeredTeamMembers,
  setRegisteredTeamMembers,
  ...props
}) => {
  const actionRef = useRef<HTMLDivElement>(null);
  const [field, meta, helpers] = useField(props);
  const [showMenu, setShowMenu] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [displayEmails, setDisplayEmails] = useState<string[]>([])
  const [filteredValues, setFilteredValues] = useState(values)
  useOnClickOutside(actionRef, () => setShowMenu(false));

  const handleChange = (email: string, id: number, event?: React.MouseEvent) => {
    if (!disabled) {
      event && event.preventDefault();
      event && event.stopPropagation();
      actionRef.current && actionRef.current.blur();
      if (!displayEmails.includes(email)) {
        setDisplayEmails([...displayEmails, email]);
        setRegisteredTeamMembers([...registeredTeamMembers, { id, email }]);
        setShowMenu(false);
        setCurrentEmail("");
      }
    }
  };

  const handleClear = (email: string, event?: React.MouseEvent) => {
    if (!disabled) {
      event && event.preventDefault();
      event && event.stopPropagation();
      helpers.setValue(field.value.filter((value) => value !== email));
      setRegisteredTeamMembers(
        registeredTeamMembers.filter((member) => member.email !== email)
      );
      setDisplayEmails(displayEmails.filter((value) => value !== email));
    }
  };

  const handleClick = () => {
    setShowMenu((show) => !disabled && !show);
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 188 && currentEmail.indexOf('@') !== -1) {
      const newEmail = currentEmail.replace(',', '');
      if (!displayEmails.includes(newEmail)) {
        setDisplayEmails([...displayEmails, newEmail]);
        if (filteredValues[0] && filteredValues[0].email === newEmail) {
          setRegisteredTeamMembers([
            ...registeredTeamMembers,
            { id: filteredValues[0].id, email: filteredValues[0].email },
          ]);
        } else {
          helpers.setValue([...field.value, newEmail]);
        }
        setCurrentEmail("");
      }
    }
    resetFilter();
    setShowMenu(true);
  };

  const resetFilter = () => {
    setFilteredValues(
      values.filter(({ email, name }) => 
        !currentEmail || 
        email.indexOf(currentEmail) !== -1 ||
        (name && name.toLowerCase().indexOf(currentEmail) !== -1)
      )
    )
  }

  useEffect(() => {
    setTimeout(() => {
      setCurrentEmail("");
      resetFilter();
    }, 100);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    resetFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={classNames(className, {
        error: meta.touched && meta.error,
      })}
    >
      <div className="d-flex justify-content-between">
        <div className="multi-emails-control__label">{label}</div>
        {!isRequired && (
          <div className="multi-emails-control__required">Optional</div>
        )}
      </div>
      <div
        className={classNames("multi-emails-control__container")}
        ref={actionRef}
      >
        <div
          className={classNames("multi-emails-control", {
            active: displayEmails && displayEmails.length,
            error: meta.touched && meta.error,
          })}
          onClick={handleClick}
        >
          <div className="flex-1 d-flex flex-wrap">
            {!!displayEmails?.length &&
              displayEmails.map((email) => {
                return (
                <div
                  key={email}
                  className="multi-emails-control__item mr-1"
                >
                  <span className="my-auto">{email}</span>
                  <img
                    src={CloseIcon}
                    alt="close"
                    className="multi-emails-control__item-close"
                    onClick={(event) => handleClear(email, event)}
                  />
                </div>
              );
            })}
            <input 
              type="text" 
              className="email-input my-1" 
              onKeyUp={handleKeyDown}
              value={currentEmail}
              placeholder={ !currentEmail && !displayEmails.length? "Enter email to invite members" : "" }
              onChange={e => setCurrentEmail(e.target.value)} 
            />
          </div>
        </div>
        <div
          className={classNames("multi-emails-control__menu", {
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
          ) : filteredValues.length === 0 ? (
            <div className="my-3 text-center text-gray">Press comma when finished typing new email</div>
          ) : (
            filteredValues.map(({ name, email, avatar, type, id }) => {
              return (
                <div
                  className={classNames("multi-emails-control__menu-item", {
                    active: displayEmails && displayEmails.includes(email),
                  })}
                  onClick={() => handleChange(email, id)}
                  key={email}
                >
                  {showAvatar && (
                    <User
                      avatar={avatar}
                      size="small"
                      className="my-auto mr-1"
                    />
                  )}
                  <div className="d-flex flex-column">
                    <div className="multi-emails-control__menu-item-name">
                      {name}
                    </div>
                    <div className="multi-emails-control__menu-item-email">
                      {email}
                    </div>
                  </div>
                  <div className="ml-auto my-auto multi-emails-control__menu-item-type">
                    {type}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="multi-emails-control__footer">
        {meta.touched && meta.error && (
          <div className="multi-emails-control__validation">
            {meta.error}
          </div>
        )}
        {help && (
          <div className="multi-emails-control__help ml-auto">
            {help}
          </div>
        )}
      </div>
    </div>
  );
};
