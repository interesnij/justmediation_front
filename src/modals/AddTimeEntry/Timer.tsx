import React from "react";
import styled from "styled-components";
import { useTimerContext } from "contexts";
import { FaPlay, FaPause } from "react-icons/fa";

export const Timer = ({ className }) => {
  const { status, time, startTimer, stopTimer } = useTimerContext();

  const handleClick = () => {
    if (status === "running") {
      stopTimer();
    } else {
      startTimer();
    }
  };
  return (
    <Container className={className} onClick={() => handleClick()}>
      {status === "running" ? (
        <FaPause color="black" size={12} />
      ) : (
        <FaPlay color="black" size={12} />
      )}
      <div className="ml-1">{time}</div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  font-family: var(--font-family-primary);
  height: 48px;
  padding: 12px;
  border: 1px solid rgba(0, 0, 0, 0.25);
  box-sizing: border-box;
  border-radius: 4px;
  color: #2e2e2e;
  margin-top: 26px;
  cursor: pointer;
  transition: alll 300ms ease;
  /* width: 120px; */
  min-width: 120px;
  justify-content: center;
  &:hover {
    border: 1px solid rgba(0,0,0,.6);
  }

  svg {
    margin: auto 0;
  }
`;
