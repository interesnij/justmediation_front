import React, { useRef, useState, useEffect } from "react";
import classNames from "classnames";
import styled from "styled-components";
import { useDebounce, useGetAttorneys, useOnClickOutside } from "hooks";
import { User } from "components";
import SearchIcon from "assets/icons/search.svg";
import CloseIcon from "assets/icons/close.svg";
import ClipLoader from "react-spinners/ClipLoader";
import { useAuthContext } from "contexts";
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
  onSelect?(item): void;
}

export const IndustryContactSearch = ({
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
  const [{ data, loading }, fetchClients] =
    useGetAttorneys(debouncedSearchTerm);
  const actionRef = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  const { userId } = useAuthContext();

  useOnClickOutside(actionRef, () => setShowMenu(false));

  const handleChange = (param) => {
    onSelect(param);
    onChange("");
    setShowMenu(false);
  };

  useEffect(() => {
    if (value) {
      setShowMenu(true);
    }
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
                avatar={data.results.find((item) => item.id === id).avatar}
                className="my-auto mr-1"
              />
              <ContactName className="my-auto">
                {data.results.find((item) => item.id === id).first_name}
                &nbsp;
                {data.results.find((item) => item.id === id).last_name}
              </ContactName>
              <ContactEmail className="my-auto ml-1">
                {data.results.find((item) => item.id === id).email}
              </ContactEmail>
            </div>
          ) : (
            <input
              type="text"
              placeholder={placeholder}
              value={value}
              onFocus={() => setShowMenu(true)}
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
          {loading ? (
            <div className="d-flex w-100 my-1">
              <ClipLoader
                css={`
                  margin: auto;
                `}
                size={32}
                color={"rgba(0, 0, 0, 0.8)"}
              />
            </div>
          ) : data &&
            data.results.filter((item) => +item.id !== +userId).length > 0 ? (
            data.results
              .filter((item) => +item.id !== +userId)
              .map((item, index: number) => {
                return (
                  <div
                    className={classNames("contact-search-control__menu-item")}
                    key={item.id}
                    onClick={() => handleChange(item)}
                  >
                    <User size="small" avatar={item.avatar} className="mr-1" />
                    <span className="my-auto">{`${item.first_name} ${item.last_name}`}</span>
                    <span className="ml-auto my-auto">{item.email}</span>
                  </div>
                );
              })
          ) : (
            <div className="mx-auto my-2 text-center">Empty</div>
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
