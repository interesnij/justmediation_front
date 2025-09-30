import useAxios from "axios-hooks";

/**
 * Get appointment types
 */
export const useGetAppointmentTypes = () => {
  const [{ data }] = useAxios("users/appointment-types");
  return data?.results || [];
};

/**
 * Get payment types
 */
export const useGetPaymentTypes = () => {
  const [{ data }] = useAxios("users/payment-types");
  return data?.results || [];
};

/**
 * Get fee kinds
 */
export const useGetFeeKinds = () => {
  const [{ data }] = useAxios("users/fee-types");
  return data?.results || [];
};

/**
 * Get currencies
 */
export const useGetCurrencies = () => {
  const [{ data }] = useAxios("users/currencies");
  return data?.results || [];
};

/**
 * Get specialiteis
 */
export const useGetSpecialties = () => {
  const [{ data }] = useAxios("users/specialities/");
  return data?.results || [];
};

/**
 * Get Languages
 */
export const useGetLanguages = () => {
  const [{ data }] = useAxios("users/languages?limit=200");
  return data ? data.results : [];
};

/**
 * Get subscriptions
 */
export const useGetSubscriptions = (type: string) => {
  const [{ data }] = useAxios(`finance/plan?type=${type}`);
  return data?.results || [];
};

/**
 * Get firm sizes
 */
export const useGetFirmSizes = () => {
  const [{ data }] = useAxios(`users/firm-sizes`);
  return data ? data.results : [];
};

/**
 * Get attorneys by search
 */
export const useGetAttorneys = (search?: string) => {
  const token = localStorage.getItem("key");
  return useAxios(
    {
      url: `users/attorneys/?search=${search}`,
      headers: {
        Authorization: `Token ${token}`,
      },
    },
    { manual: true }
  );
};
