import React, { useState, useMemo, useEffect } from "react";
import classNames from "classnames";
import useOnclickOutside from "react-cool-onclickoutside";
import { Button, RiseLoader, User } from "components";
import CloseIcon from "assets/icons/close.svg";

interface Props {
  open: boolean;
  setOpen(open: boolean): void;
  onAccept?(): void;
  onDecline?(): void;
  callObject: any; 
}
export const JoinCallModal = ({
  open,
  setOpen,
  onAccept = () => {},
  onDecline = () => {},
  callObject
}: Props) => {
  const ref = useOnclickOutside(() => {
    onDecline();
  });

  useEffect(() => {
    if (!callObject) onDecline();
  }, [callObject])  

  const audioPath2 = 'https://app.jusmediation.com/sounds/voxeet_notify.mp3';
  const audiow = useMemo(() => new Audio(audioPath2), []);
  //const audiow = new Audio(audioPath2);
  audiow.play();
  audiow.loop = true;

  //if (audiow.ended) {
  //  audiow.play();
  //}

  let a_pause = function() {
    if (!audiow.ended) {
      audiow.pause();
    }
  }


  const message = callObject?.isGroup 
    ? `is inviting you to join group call`
    : `is calling you`;

  return (
    <div className={classNames("alert-control-container", { open })}>
      <div ref={ref} tabIndex={-1} className="alert-control">
        <div className="alert-control__header">
          <img
            className="my-auto ml-auto close"
            src={CloseIcon}
            onClick={() => { setOpen(false); a_pause();}}
            //onClick={() => setOpen(false)}
            alt="close"
          /> 
        </div>
        <div className="alert-control__content">
          <div className="title mb-4">
            {callObject?.host?.avatar && 
              <User
                size="large" 
                className="mx-auto mb-4" 
                avatar={callObject?.host.avatar} 
              />
            }
            {callObject?.host?.name}
          </div>

          <div>{message}</div>
          <div className="alert-control__footer mt-4">
            <Button  
              className="ml-auto"
              onClick={(e) => { onDecline(); a_pause(); audiow.muted = true; console.log("audiow pause");}}
              theme="red"
            >
              Decline
            </Button>
            <Button
              className="ml-3 mr-auto"
              theme="green"
              onClick={(e) => { onAccept(); a_pause(); audiow.muted = true;}}
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
