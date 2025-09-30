import { API } from "helpers";
import { MATTERS_PER_PAGE } from "config";

interface BillingSearchParams {
  page?: number;
  pageSize?: number;
  matter?: number;
  search?: string;
  billing_type?: string;
  ordering?: string;
  fromDate?: string;
  toDate?: string;
  isBillable?: boolean;
}
/** Get billings. */
export const getBillings = async ({
  page = 0,
  pageSize = MATTERS_PER_PAGE,
  matter,
  search,
  billing_type,
  fromDate,
  toDate,
  isBillable,
  ordering,
}: BillingSearchParams) => {
  const params = {
    offset: page * (pageSize || 0),
    limit: pageSize,
    matter,
    search,
    billing_type,
    date__gte: fromDate,
    date__lte: toDate,
    is_billable: isBillable,
    ordering: ordering || "-modified",
  };
  try {
    const response = await API().get(`business/time-billing/`, { params });
    return response.data;
  } catch (error) {
    return {
      results: [],
      count: 0,
      error,
    };
  }
};

/** Get time billing by id */
export const getTimeBillingById = async (id) => {
  try {
    const response = await API().get(`business/time-billing/${id}`);
    return response.data;
  } catch (error) {
    return {
      results: [],
      count: 0,
      error,
    };
  }
};

/** Create time billing */
export const createTimeBilling = (data) => {
  return API().post(`business/time-billing/`, data);
};

/** Update time billing */
export const updateTimeBilling = (data) => {
  return API().put(`business/time-billing/${data?.id}/`, data);
};

/** Update time billing */
export const updateTimeBillingPartial = (data) => {
  return API().patch(`business/time-billing/${data?.id}/`, data);
};

/** Delete billing item */
export const deleteBiling = (id: number) => {
  return API().delete(`business/time-billing/${id}/`);
};
