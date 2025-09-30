import React, { useState, useEffect, createContext, useContext } from "react";
import { useLocalstorage } from "rooks";

export interface MatterContextInterface {
  matters: any[];
  createdId: any;
  updateMatters(matters: any[]): void;
  getMatterById(id: number): any;
  setCreatedId(id?: any): void;
}
const initialState: MatterContextInterface = {
  matters: [],
  createdId: null,
  updateMatters: () => {},
  getMatterById: () => {},
  setCreatedId: () => {},
};

export const MatterContext = createContext<MatterContextInterface>(
  initialState as MatterContextInterface
);

export const useMatterContext = () => useContext(MatterContext);

export const MatterProvider = ({ children }) => {
  const [value, set] = useLocalstorage("matter-state", initialState);
  const [state, setState] = useState(value);

  const updateMatters = (params: any[] = []) => {
    let temp = state?.matters ? [...state.matters] : [];
    params.forEach((matter) => {
      const idx = temp.findIndex((a) => a.id === matter.id);
      if (idx > -1) {
        temp[idx] = matter;
      } else {
        temp.push(matter);
      }
    });
    setState({ matters: temp, ...state?.createdId });
  };

  const setCreatedId = (id: any) => {
    setState({ ...state?.matters, createdId: id });
  };

  const getMatterById = (id: number) => {
    return state?.matters
      ? state.matters.find((matter) => +matter.id === +id) ?? {}
      : {};
  };

  useEffect(() => {
    set(state);
    return () => {};
  }, [state, set]);

  return (
    <MatterContext.Provider value={{ ...state, updateMatters, setCreatedId, getMatterById }}>
      {children}
    </MatterContext.Provider>
  );
};
