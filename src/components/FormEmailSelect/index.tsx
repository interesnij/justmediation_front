/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState, useEffect } from "react";
import classNames from "classnames";
import styled from "styled-components";
import { useDebounce, useOnClickOutside } from "hooks";
import { useField, FieldHookConfig } from "formik";
import { FormSelect, User } from "components";
import { useQuery } from "react-query";
import { getAttorneysAndParalegals } from "api";
import { getUserName } from "helpers";
import SearchIcon from "assets/icons/search.svg";
import CloseIcon from "assets/icons/close.svg";
import ClipLoader from "react-spinners/ClipLoader";
type Props = FieldHookConfig<any> & {
  label?: string;
  className?: string;
  placeholder?: string;
  help?: string;
  isRequired?: boolean;
  onSelect?: (arg: any) => void;
  registeredTeamMembers: { id: number, email: string }[];
  setRegisteredTeamMembers: (obj: any) => void;
  teamMembers: { email: string, type: string, uid?: string }[];
};

export const FormEmailSelect: React.FC<Props> = ({
  label,
  className,
  placeholder = "Search by email or name",
  isRequired,
  onSelect,
  registeredTeamMembers,
  setRegisteredTeamMembers,
  teamMembers,
  ...props
}: Props) => {
  const [field, meta, helpers] = useField(props);
  const [value, setValue] = useState("")
  const debouncedSearchTerm = useDebounce(value, 500);
  const [currentEmail, setCurrentEmail] = useState<string>();

  const {
    isLoading,
    isFetching,
    data,
    refetch: fetchClients,
  } = useQuery<any[], Error>(
    ["attorneys_paralegals", debouncedSearchTerm],
    () =>
      getAttorneysAndParalegals({
        search: debouncedSearchTerm,
      }),
    {
      keepPreviousData: true,
      enabled: !!debouncedSearchTerm,
    }
  );

  const actionRef = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  useOnClickOutside(actionRef, () => setShowMenu(false));

  const handleChange = (param) => {
    helpers.setValue(param);
    setValue(param);
    if (data && data[0]?.email === param) {
      setRegisteredTeamMembers([...registeredTeamMembers, { id: data[0].id, email: data[0].email }]);
      setCurrentEmail(data[0].email);
      helpers.setValue(data[0].email);
      setShowMenu(false);
      setValue("")
    }
  };

  const handleSelect = (param) => {
    if (!teamMembers.some(member => member.email.includes(param.email))) {
      setRegisteredTeamMembers([...registeredTeamMembers, param]);
      setCurrentEmail(param.email);
      helpers.setValue(param.email);
      setShowMenu(false);
    }
  };

  const handleClear = () => {
    helpers.setValue("");
    setRegisteredTeamMembers(
      registeredTeamMembers.filter((user) => user.email !== currentEmail)
    );
    setCurrentEmail("");
  };

  // Effect for API call
  useEffect(
    () => {
      if (debouncedSearchTerm) {
        setShowMenu(true);
        fetchClients();
      } else {
        setShowMenu(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedSearchTerm] // Only call effect if debounced search term changes
  );
  return (
    <div className={classNames("contact-search-control", className)}>
      {label && (
        <div className="d-flex justify-content-between">
          <div className="contact-search-control__label">{label}</div>
          {isRequired && (
            <div className="contact-search-control__required">Required</div>
          )}
        </div>
      )}
      <div className="contact-search-control__container" ref={actionRef}>
        <div
          className={classNames("contact-search-control__main", {
            active: showMenu,
          })}
        >
          {!currentEmail && (
            <img
              src={SearchIcon}
              className="contact-search-control__find mr-1"
              alt="search"
            />
          )}
          {currentEmail ? (
            <div className="d-flex flex-start">
              <User
                size="small"
                avatar={
                  (data || []).find((item) => item?.email === currentEmail)
                    ?.avatar
                }
                className="my-auto mr-1"
              />
              <ContactName className="my-auto">
                {getUserName(
                  (data || []).find((item) => item?.email === currentEmail)
                )}
              </ContactName>
              <ContactEmail className="my-auto ml-1">
                {
                  (data || []).find((item) => item?.email === currentEmail)
                    ?.email
                }
              </ContactEmail>
            </div>
          ) : (
            <input
              type="text"
              placeholder={placeholder}
              value={field.value}
              onFocus={() => setShowMenu(!!field.value && true)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(e.target.value)
              }
            />
          )}
          {currentEmail && (
            <img
              src={CloseIcon}
              className="contact-search-control__find ml-auto"
              alt="close"
              onClick={() => handleClear()}
            />
          )}
        </div>
        <div
          className={classNames("contact-search-control__menu", {
            active: showMenu,
          })}
        >
          {isLoading || isFetching ? (
            <div className="d-flex w-100 my-1">
              <ClipLoader
                css={`
                  margin: auto;
                `}
                size={32}
                color={"rgba(0, 0, 0, 0.8)"}
              />
            </div>
          ) : data && data?.length > 0 ? (
            data?.map((item, index: number) => {
              return (
                <div
                  className={classNames("contact-search-control__menu-item", { active: teamMembers && teamMembers.some(i => i.email.includes(item.email)) })}
                  key={item?.user_id || item?.id}
                  onClick={() => handleSelect(item)}
                >
                  <User size="small" avatar={item.avatar} className="mr-1" />
                  <span className="my-auto">{getUserName(item)}</span>
                  <span className="ml-auto my-auto">{item.email}</span>
                </div>
              );
            })
          ) : (
            <div className="mx-auto my-2 text-center">Not Registered User</div>
          )}
        </div>
      </div>
    </div>
  );
};

const ContactName = styled.div`
  color: #2e2e2e;
  font-size: 14px;
`;
const ContactEmail = styled.div`
  color: #98989a;
  font-size: 12px;
`;
