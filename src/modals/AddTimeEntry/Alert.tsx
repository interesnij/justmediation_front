import React from "react";
import { Modal, Button } from "components";

interface Props {
    open: boolean;
    setOpen(param: boolean): void;
    onLeave?(): void;
    onStopLeave?(): void;
}
export const Alert = ({
    open,
    setOpen,
    onLeave,
    onStopLeave,
}: Props) => {
    return (
        <Modal
            open={open}
            setOpen={(param) => {
                setOpen(param);
            }}
            disableOutsideClick
            disableClose
            title='Attention'
            isTitleCenter
        >
            <div className="pb-4">
                <div className="text-black text-center" style={{ fontSize: 18 }}>
                    Are you sure you want to leave this page? <br />
                    Do you want to stop the timer?
                </div>
                <br />
            </div>
            <div className="d-flex">
                <Button
                    className="ml-auto"
                    onClick={() => {
                        setOpen(false);
                    }}
                    theme="white"
                >
                    Cancel
                </Button>
                <Button
                    className="ml-3"
                    onClick={onLeave}
                >
                    Leave
                </Button>
                <Button
                    className="ml-3 mr-auto"
                    onClick={onStopLeave}
                    theme="red"
                >
                    Stop and Leave
                </Button>
            </div>
        </Modal>
    );
};
