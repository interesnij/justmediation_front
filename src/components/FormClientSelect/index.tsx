import React, { useRef, useState, useEffect } from "react";
import classNames from "classnames";
import { User } from "components";
import { useOnClickOutside } from "hooks";
import { useField, FieldHookConfig } from "formik";
import ClipLoader from "react-spinners/ClipLoader";
import ArrowIcon from "assets/icons/arrow-drop-down.svg";
import "./style.scss";

type Props = FieldHookConfig<number> & {
  values?: {
    label: string;
    value: any;
    currency?: string;
  }[];
  label?: string;
  className?: string;
  placeholder?: string;
  help?: string;
  isRequired?: boolean;
  onSelect?(param): void;
  clientsData: { 
    results: any[]; 
    count: number 
  } | undefined;
  isLoading: boolean;
};

type Contact = {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string;
  email: string;
}

export const FormClientSelect: React.FC<Props> = ({
  label,
  className,
  help,
  values = [],
  placeholder = "Search or select a lead/ client contact",
  isRequired,
  onSelect = () => {},
  isLoading,
  clientsData,
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [field, meta, helpers] = useField(props);
  const actionRef = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [list, setList] = useState<any[]>([]);
  useOnClickOutside(actionRef, () => setShowMenu(false));

  const handleChange = (param) => {
    helpers.setValue(param.id);
    onSelect(param);
    setShowMenu(false);
    setSearchTerm("");
  };

  const filterList = () => {
    if (!clientsData?.results?.length) 
      return [];
    if (!searchTerm) 
      return clientsData.results;
    const q: string = searchTerm.toLowerCase();
    return clientsData?.results?.filter(
      (item: Contact) => 
        [item.first_name, item.last_name].join(' ').toLowerCase().indexOf(q) !== -1  
    )
  }

  useEffect(() => {
    if (searchTerm)
      setShowMenu(true);
    setList(filterList())
  }, [searchTerm, clientsData?.results])

  return (
    <div
      className={classNames("client-select-control", className, {
        error: meta.touched && meta.error,
      })}
    >
      {label && (
        <div className="d-flex justify-content-between">
          <div className="client-select-control__label">{label}</div>
          {isRequired && (
            <div className="client-select-control__required">Required</div>
          )}
        </div>
      )}
      <div className="client-select-control__container search_container" ref={actionRef}>
        <div
          onClick={() => setShowMenu(!showMenu)}
          className={classNames("client-select-control__main", {
            active: showMenu,
          })}
        >
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
          />
          <img
            src={ArrowIcon}
            className="client-select-control__arrow"
            alt="arrow"
          />
        </div>
        <div
          className={classNames("client-select-control__menu", {
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
          ) : list.length === 0 ? (
            <div className="my-3 text-center text-gray">No results</div>
          ) : (
            list.map((item: any, index: number) => {
              return (
                <div
                  className={classNames("client-select-control__menu-item", {
                    active: field.value === item.id,
                  })}
                  key={item.id}
                  onClick={() => handleChange(item)}
                >
                  <User
                    avatar={item.avatar}
                    size="small"
                    className="my-auto mr-1"
                  />

                  <div className="d-flex flex-column">
                    <div className="contact-select-control__menu-item-name">
                      {item?.first_name} {item?.last_name}
                    </div>
                    <div className="contact-select-control__menu-item-email">
                      {item?.email}
                    </div>
                  </div>
                  <div className="ml-auto my-auto contact-select-control__menu-item-type">
                    {item?.type}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="client-select-control__footer">
        {meta.touched && meta.error && (
          <div className="client-select-control__validation">{meta.error}</div>
        )}
        {help && (
          <div className="client-select-control__help ml-auto">{help}</div>
        )}
      </div>
    </div>
  );
};
