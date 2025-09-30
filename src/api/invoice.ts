import { API } from "helpers";
import { MATTERS_PER_PAGE } from "config";

/**
 * Create new invoice.
 * @param data
 */
export const createInvoice = (data) => {
  return API().post("business/invoices/", data);
};

/**
 * Update existing invoice.
 * @param id
 * @param data
 */
export const updateInvoice = (id, data) => {
  return API().put(`business/invoices/${id}/`, data);
};

/**
 * Delete invoice
 * @param id invoice id
 */
 export const deleteInvoice = (id) => {
  return API().delete(`business/invoices/${id}/`);
};

/**
 * Send invoice.
 * @param invoiceId Invoice id.
 * @param invoice Invoice to send.
 */
export const sendInvoice = (invoiceId: number, invoice) => {
  return API().post(`business/invoices/${invoiceId}/send/`, invoice);
};

/**
 * Draft invoice.
 * @param invoice Invoice to send.
 */
export const draftInvoice = (invoice) => {
  return API().post(`business/invoices/draft/`, invoice);
};

/**
 * Reopen invoice
 * @param invoiceId
 */
 export const reopenInvoice = (invoiceId: number) => {
  return API().post(`business/invoices/${invoiceId}/open/`);
};

/**
 * Get invoice by id.
 * @param id Id of an invoice.
 */
export const getInvoiceById = async (id: number) => {
  try {
    const res = await API().get(`business/invoices/${id}/`);
    return res?.data || {};
  } catch (error) {
    return {};
  }
};

/**
 * Get download invoice url.
 * @param id Invoice id.
 */
export const downloadInvoice = async (id: number) => {
  try {
    const response = await API().get(`business/invoices/${id}/export/`);
    return response.data?.link;
  } catch (error) {
    return "";
  }
};
interface InvoiceSearchParams {
  /** page size. */
  pageSize?: number;
  /** page number. */
  page?: number;
  /** search title. */
  search?: string;
  /** From date. */
  fromDate?: string;
  /** To date. */
  toDate?: string;
  /** Matter id */
  matter?: number;
  /** Client. */
  client?: number | string;
  /** Status. */
  status?: string;
  /** Ordering. */
  ordering?: string;
  /** User ID */
  createdBy?: number;
  statuses?: [];
  paymentStatuses?: [];
}
/**
 * Get invoices.
 * @param filter Invoices query.
 */

export const getInvoices = async ({
  page = 0,
  pageSize = MATTERS_PER_PAGE,
  search = "",
  fromDate,
  toDate,
  matter,
  client,
  status,
  ordering,
}: InvoiceSearchParams) => {
  let params = {
    limit: pageSize,
    offset: pageSize * page,
    search,
    period_start: fromDate,
    period_end: toDate,
    matter,
    client,
    status,
    ordering: ordering || "-modified",
  };
  try {
    const res = await API().get("business/invoices/", { params });
    return res.data;
  } catch (error) {
    return {
      results: [],
      count: 0,
      error,
    };
  }
};

/**
 * Duplicate invoice.
 * @param id Invoice id.
 */
export const duplicateInvoice = (id: number) => {
  return API().post(`business/invoices/${id}/duplicate/`);
};

/**
 * Pay invoice.
 * @param id Invoice id.
 */
export const payInvoice = (id: number) => {
  return API().post(`business/invoices/${id}/pay/`);
};

export const updatePartialInvoice = (id: number, data?: any) => {
  return API().patch(`business/invoices/${id}/`, data);
}