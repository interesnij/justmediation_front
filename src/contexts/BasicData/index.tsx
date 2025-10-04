import React, { useState, useEffect, createContext, useContext } from "react";
import { useLocalstorage } from "rooks";
import { useAuthContext } from "contexts";
import {
  // getCountries,
  getCities,
  getTopCities,
  getStates,
  getSpecialties,
  getAppointmentTypes,
  getPaymentTypes,
  getFeeTypes,
  getCurrencies,
  getLanguages,
  getFirmSizes,
  getAllForumTopics,
  getTimezones,
  getCurrentSubscriptionProfile,
} from "api";

export interface BasicDataContextInterface {
  countries: any;
  states: any;
  cities: any;
  specialties: { id: number; title: string, created_by: number | null }[];
  currencies: { id: number; title: string }[];
  feeTypes: { id: number; title: string }[];
  appointmentTypes: { id: number; title: string }[];
  paymentTypes: { id: number; title: string }[];
  languages: { id: number; title: string }[];
  firmSizes: { id: number; title: string }[];
  forumCategories: { id: number; title: string }[];
  timezones: { id: number; title: string }[];
  topCities: { id: number; name: string; state: { id: number; name: string; } }[];
  subscriptionInfo: any;
  initBasicData(userType: string): void;
  refetchSpecialties(id?: number | string): void;
  fetchCities(params: any): void;
  fetchTopCities(): void;
}
const initialState: BasicDataContextInterface = {
  countries: [],
  states: [],
  cities: [],
  specialties: [],
  currencies: [],
  feeTypes: [],
  appointmentTypes: [],
  paymentTypes: [],
  languages: [],
  firmSizes: [],
  forumCategories: [],
  timezones: [],
  topCities: [],
  subscriptionInfo: {},
  initBasicData: (userType: string) => {},
  refetchSpecialties: (id?: number | string) => {},
  fetchCities: () => {},
  fetchTopCities: () => {}
};

export const BasicDataContext = createContext<BasicDataContextInterface>(
  initialState as BasicDataContextInterface
);

export const useBasicDataContext = () => useContext(BasicDataContext);

export const BasicDataProvider = ({ children }) => {
  const [value, set] = useLocalstorage("BasicData-state", initialState);
  const { userType } = useAuthContext();

  const [state, setState] = useState(value);

  useEffect(() => {
    set(state);
    return () => {};
  }, [state, set]);

  useEffect(() => {
    if (!value) {
      initBasicData(userType);
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initBasicData = async (_userType) => {

    let res = await getSpecialties();
    setState((state: BasicDataContextInterface) => {
      return { ...state, specialties: res.data.results };
    });
    res = await getAppointmentTypes();
    setState((state: BasicDataContextInterface) => {
      return { ...state, appointmentTypes: res.data.results };
    });
    res = await getPaymentTypes();
    setState((state: BasicDataContextInterface) => {
      return { ...state, paymentTypes: res.data.results };
    });
    res = await getFeeTypes();
    setState((state: BasicDataContextInterface) => {
      return { ...state, feeTypes: res.data.results };
    });
    res = await getCurrencies();
    setState((state: BasicDataContextInterface) => {
      return { ...state, currencies: res.data.results };
    });
    res = await getLanguages();
    setState((state: BasicDataContextInterface) => {
      return { ...state, languages: res.data.results };
    });
    res = await getFirmSizes();
    setState((state: BasicDataContextInterface) => {
      return { ...state, firmSizes: res.data.results };
    });
    res = await getAllForumTopics();
    setState((state: BasicDataContextInterface) => {
      return { ...state, forumCategories: res.data.results };
    });
    res = await getTimezones();
    setState((state: BasicDataContextInterface) => {
      return { ...state, timezones: res.data.results };
    });
    res = await getStates(1);
    setState((state: BasicDataContextInterface) => {
      return { ...state, states: res };
    });
    if (_userType === "mediator") {
      res = await getCurrentSubscriptionProfile();
      setState((state: BasicDataContextInterface) => {
        return { ...state, subscriptionInfo: res };
      });
    }
    if (_userType === "client") {
      fetchTopCities();
    }
  };

  const fetchCities = async (param) => {
    const res = await getCities(param);
    setState((state: BasicDataContextInterface) => {
      return { ...state, cities: res };
    });
  };

  const refetchSpecialties = async (id?: number | string) => {
    let res = await getSpecialties(id);
    setState((state: BasicDataContextInterface) => {
      return { ...state, specialties: res.data.results };
    });
  };

  const fetchTopCities = async () => { 
    let res = await getTopCities(); 
    setState((state: BasicDataContextInterface) => {
      return { ...state, topCities: res.results }
    });
  };

  return (
    <BasicDataContext.Provider
      value={{ ...state, initBasicData, refetchSpecialties, fetchCities, fetchTopCities }}
    >
      {children}
    </BasicDataContext.Provider>
  );
};
