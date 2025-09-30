import { useRef, useState } from "react";
import classNames from "classnames";
import styled from "styled-components";
import { useOnClickOutside } from "hooks";
import { createMaterStage } from "api";
import { ScaleLoader } from "components";
import { useAuthContext } from "contexts";
import DropDownIcon from "assets/icons/arrow-drop-down.svg";
import PlusIcon from "assets/icons/plus_green.svg";
import CloseIcon from "assets/icons/close.svg";
import "./style.scss";

interface Props {
  data: {
    title: string;
    id: any;
  }[];
  value: any;
  stage?: any;
  className?: string;
  label?: string;
  backgroundColor?: string;
  width?: number;
  onChange(param): void;
  onSelect?(param): void;
  onUpdate(): void;
  disabled?: boolean;
}

export const MatterStageSelect = ({
  data,
  value,
  stage,
  onChange,
  label,
  className,
  backgroundColor = "#eee",
  width = 200,
  onUpdate = () => {},
  onSelect = () => {},
  disabled = false,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  useOnClickOutside(containerRef, () => setShowMenu(false));
  const { userType } = useAuthContext();

  const handleChange = (params) => {
    if (params !== value) {
      onChange(params);
      onSelect(params);
    }
    setShowMenu(false);
  };
  const handleClick = () => {
    setShowMenu((show) => !disabled && !show);
  };
  return (
    <div className={classNames("d-flex", className)}>
      {label && <span className="select-label my-auto">{label}</span>}
      <div ref={containerRef} className="matter-stage-select-container">
        <div className="menu-button" onClick={handleClick}>
          <span>
            {data.length > 0
              ? data.find((item) => item.id === value)?.title
              : stage? stage.title : ""}
          </span>
          <img
            src={DropDownIcon}
            className="menu-button__drop-down"
            alt="drop-down"
          />
        </div>
        <div
          className={classNames("menu-dropdown", { active: showMenu })}
          style={{ width: width + 16 }}
        >
          {data.map((item) => {
            return (
              <div
                className={classNames(
                  "menu-item",
                  item.id === value ? "active" : ""
                )}
                key={item.id}
                onClick={() => handleChange(item.id)}
                style={{ width }}
              >
                {item.title}
              </div>
            );
          })}
          {
            (data.length === 0 && stage) &&
            <div
              className={classNames(
                "menu-item",
                stage.id === value ? "active" : ""
              )}
              key={stage.id}
              onClick={() => handleChange(stage.id)}
              style={{ width }}
            >
              {stage.title}
            </div>
          }
          {
            userType !== "paralegal" && userType !== "other" && (!showCreate ? (
              <div
                className="menu-item d-flex cursor-pointer"
                onClick={() => setShowCreate(true)}
              >
                <img
                  src={PlusIcon}
                  style={{ width: 16 }}
                  alt="plus"
                  className="my-auto mr-1"
                />
                <div>Create matter stage</div>
              </div>
            ) : (
              <AddInput
                onClose={() => setShowCreate(false)}
                onAdd={() => {
                  setShowCreate(false);
                  onUpdate();
                }}
              />
            ))
          }
          
        </div>
      </div>
    </div>
  );
};

const AddInputContainer = styled.div`
  position: relative;
  display: flex;
  input {
    border-radius: 4px;
    height: 32px;
    line-height: 32px;
    color: #000;
    transition: all 300ms ease;
    font-size: 14px;
    border: 1px solid rgba(0, 0, 0, 0.25);
    font-family: var(--font-family-primary);
    display: flex;
    width: 100%;
    padding: 0 24px 0 8px;
    &.active,
    &:focus,
    &:active,
    &:hover {
      border: 1px solid var(--green);
      outline: none;
    }
  }
  img {
    position: absolute;
    width: 12px;
    right: 0;
    margin-right: 8px;
    margin-top: 10px;
  }
`;
const AddInput = ({ onClose = () => {}, onAdd = () => {} }) => {
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleClear = () => {
    setValue("");
    onClose();
  };
  const handleKeyDown = async (e) => {
    if (e.keyCode === 13) {
      setIsLoading(true);
      await createMaterStage({
        title: value,
      });
      onAdd();
      setValue("");
      setIsLoading(false);
    }
  };
  return (
    <AddInputContainer>
      {isLoading ? (
        <ScaleLoader className="m-auto" />
      ) : (
        <>
          {value && (
            <img
              src={CloseIcon}
              className="cursor-pointer"
              alt="close"
              onClick={handleClear}
            />
          )}
          <input
            value={value}
            onKeyDown={handleKeyDown}
            onChange={(e) => setValue(e.target.value)}
          />
        </>
      )}
    </AddInputContainer>
  );
};
