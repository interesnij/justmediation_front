import React from "react";
import styled from "styled-components";
import { Modal } from "components";
import Iframe from "react-iframe";
interface Props {
  open: boolean;
  setOpen(param: boolean): void;
  onCreate?(params: any): void;
  matter?: string | number;
  client?: string | number;
  data?: any;
}
export const ESignModal = ({
  open,
  setOpen,
  matter,
  client,
  data,
  onCreate = () => {},
}: Props) => {
  let reset = () => {};

  return (
    <Modal
      title={"E-Sign"}
      open={open}
      setOpen={(param) => {
        setOpen(param);
        reset();
      }}
    >
      <Container className="new-post-modal">
        <Iframe
          url="https://www.docusign.com/"
          width="100%"
          height="100%"
          id="myId"
          className="myClassname"
          position="relative"
        />
      </Container>
    </Modal>
  );
};

const Container = styled.div`
  height: 600px;
  width: 800px;
`;
