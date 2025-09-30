import React, { useState, useEffect } from "react";
import styled from "styled-components";
import EditImg from "assets/icons/edit.svg";
import CloseImg from "assets/icons/close.svg";
interface Props {
  className?: string;
  edit?: boolean;
  value?: string;
  renamable?: boolean;
  onChange?(params: string): void;
  onChangeName?(params: string): void;
}

export const InputEdit = ({
  className,
  edit = false,
  value = "",
  renamable = false,
  onChange = () => {},
  onChangeName = () => {},
}: Props) => {
  const [state, setState] = useState(edit);
  const [innerValue, setInnerValue] = useState(value);

  const handleChangeState = () => {
    if (state) {
      onChange('');
      setInnerValue('');
    }
    else setState((state) => !state);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInnerValue(e.target?.value);
  };

  useEffect(() => {
    setInnerValue(value);
    return () => {};
  }, [value]);

  useEffect(() => {
    setState(edit);
    return () => {};
  }, [edit]);

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      if (e.target.value.trim() === '') return;
      onChange(e.target.value);
      onChangeName(e.target.value);
      setState((state) => !state);
    }
  };

  return (
    <Container className={className}>
      {state ? (
        <Edit>
          <CloseButton onClick={handleChangeState}>
            <img src={CloseImg} alt="close" />
          </CloseButton>
          <input
            value={innerValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </Edit>
      ) : (
        <Normal>
          <div className="my-auto mr-1">{value}</div>
          {
            renamable &&
            <IconButton className="ml-auto my-auto" onClick={handleChangeState}>
              <img src={EditImg} alt="edit" />
            </IconButton>
          }
        </Normal>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  width: 100%;
`;

const Normal = styled.div`
  display: flex;
  height: 48px;
  width: 100%;
  font-size: 14px;
  img {
    width: 20px;
    height: 20px;
  }
`;

const IconButton = styled.div`
  cursor: pointer;
  transition: all 300ms ease;
  &:hover {
    opacity: 0.7;
  }
`;
const CloseButton = styled(IconButton)`
  position: absolute;
  right: 0;
  margin-top: 14px;
  margin-right: 14px;
  img {
    width: 12px;
    height: 12px;
  }
`;
const Edit = styled.div`
  height: 48px;
  position: relative;
  width: 100%;
  input {
    color: #2e2e2e;
    height: 48px;
    font-size: 14px;
    border-radius: 4px;
    border: 1px solid rgba(0,0,0,.6);
    outline: none;
    padding: 12px 36px 12px 12px;
    width: 100%;
  }
`;
