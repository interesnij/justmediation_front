import { useState } from "react";

export const useModal = (initialValue: boolean = false) => {
  const [open, setOpen] = useState(initialValue);

  return {
    open,
    setOpen,
  };
};
