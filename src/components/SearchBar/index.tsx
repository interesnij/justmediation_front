import React, { useEffect, useState, memo } from "react";
import SearchIcon from "assets/icons/search.svg";
import LocationIcon from "assets/icons/location_gray.svg";
import CloseIcon from "assets/icons/close.svg";
import { useDebounce } from "hooks";

import "./style.scss";
interface Props {
  icon?: "search" | "marker";
  value?: string;
  className?: string;
  placeholder?: string;
  onChange?(param: string): void;
  onEnter?(params: string): void;
  onClear?(): void;
  onClick?(): void;
  onKeyDown?(param?: string): void;
}
const SearchBarComponent = ({
  icon,
  value = "",
  className,
  onChange = () => {},
  onEnter = () => {},
  onClear = () => {},
  onClick = () => {},
  onKeyDown = () => {},
  placeholder,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(
    () => {
      onChange(searchTerm);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [debouncedSearchTerm] // Only call effect if debounced search term changes
  );

  // const handleChange = (param: React.ChangeEvent<HTMLInputElement>) => {
  //   onChange(param.target.value)
  // };
  
  const handleClose = () => {
    setSearchTerm("");
    onClear();
  };

  const handleKeyDown = (e) => {
    onKeyDown();
    if (e.keyCode === 13) {
      onEnter(e.target.value);
    }
  };

  useEffect(() => {
    setSearchTerm(value);
    return () => {};
  }, [value]);

  return (
    <div className={`search-bar-container ${className}`}>
      {icon === "search" ? (
        <img src={SearchIcon} alt="search" />
      ) : icon === "marker" ? (
        <img src={LocationIcon} alt="location" />
      ) : null}
      <input
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
        value={searchTerm}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        onClick={onClick}
      />
      {searchTerm && (
        <img
          className="close-icon"
          src={CloseIcon}
          alt="close"
          onClick={handleClose}
        />
      )}
    </div>
  );
};

export const SearchBar = memo(SearchBarComponent)