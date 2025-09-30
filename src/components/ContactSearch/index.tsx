import React, { useRef, useState, useEffect } from "react";
import classNames from "classnames";
import styled from "styled-components";
import { useDebounce, useOnClickOutside } from "hooks";
import { User } from "components";
import { useQuery } from "react-query";
import { getClients } from "api";
import SearchIcon from "assets/icons/search.svg";
import CloseIcon from "assets/icons/close.svg";
import ClipLoader from "react-spinners/ClipLoader";
import "./style.scss";

interface Props {
  label?: string;
  className?: string;
  placeholder?: string;
  help?: string;
  value?: string;
  onChange?(params: string): void;
  isRequired?: boolean;
  id?: string;
  onSelect?(params): void;
}

export const ContactSearch = ({
  label,
  className,
  placeholder = "Search by email or name",
  isRequired,
  id,
  onSelect = () => {},
  value,
  onChange = () => {},
}: Props) => {
  
  const debouncedSearchTerm = useDebounce(value, 500);
  const {
    isLoading,
    data,
    refetch: fetchClients,
  } = useQuery<any[], Error>(
    ["all-clients", debouncedSearchTerm],
    () =>
      getClients({
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

  const handleChange = (param: any) => {
    onSelect(param);
    onChange("");
    setShowMenu(false);
  };

  useEffect(() => {
    if (value) {
      setShowMenu(true);
    }
    else setShowMenu(false);
    return () => {};
  }, [value]);

  // Effect for API call
  useEffect(
    () => {
      if (debouncedSearchTerm) {
        setShowMenu(true);
        fetchClients();
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
          {!id && (
            <img
              src={SearchIcon}
              className="contact-search-control__find mr-1"
              alt="search"
            />
          )}
          {id ? (
            <div className="d-flex flex-start">
              <User
                size="small"
                avatar={
                  (data || []).find((item: any) => +item.id === +id)?.avatar
                }
                className="my-auto mr-1"
              />
              <ContactName className="my-auto">
                {(data || []).find((item: any) => +item.id === +id)?.name}
              </ContactName>
              <ContactEmail className="my-auto ml-1">
                {(data || []).find((item: any) => +item.id === +id)?.email}
              </ContactEmail>
            </div>
          ) : (
            <input
              type="text"
              placeholder={placeholder}
              value={value}
              onFocus={() => { if (value) setShowMenu(true) }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onChange(e.target.value)
              }
            />
          )}
          {id && (
            <img
              src={CloseIcon}
              className="contact-search-control__find ml-auto"
              alt="close"
              onClick={() => onSelect("")}
            />
          )}
        </div>
        <div
          className={classNames("contact-search-control__menu", {
            active: showMenu,
          })}
        >
          {isLoading ? (
            <div className="d-flex w-100 my-1">
              <ClipLoader
                css={`
                  margin: auto;
                `}
                size={32}
                color={"rgba(0, 0, 0, 0.8)"}
              />
            </div>
          ) : (
            <div>
              {data && data?.length > 0 && (
                data?.map((item: any, index: number) => {
                  return (
                    <div
                      className={classNames("contact-search-control__menu-item")}
                      key={item.id}
                      onClick={() => handleChange(item)}
                    >
                      <User size="small" avatar={item.avatar} className="mr-1" />
                      <span className="my-auto">{`${item.name}`}</span>
                      <span className="ml-auto my-auto">{item.email}</span>
                    </div>
                  );
                }))
              }
              <div className="mx-auto my-2 text-center text-sm-black">Don't see the person you are looking for?<br />
                Enter their email in the search bar and click "<strong>Invite new user</strong>" to invite them to the platform.</div>
            </div>
          )
          }

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
