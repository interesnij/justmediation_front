import { API } from "helpers";

/**
 * Export invoice info to quickbooks.
 * @param invoiceId Invoice id.
 * @param clientId Id of a quickbooks client.
 */
export const exportInvoice = (invoiceId: number, clientId: number) => {
  return API().post("accounting/export/invoice/", {
    data: {
      invoice: invoiceId,
      customer: clientId,
    },
  });
};

/**
 * Get external link to authorize in QuickBooks.
 * @param successUrl Url to navigate after successful authorization.
 * @param errorUrl Url to navigate after error.
 */
export const getUrlToAuthorize = (successUrl: string, errorUrl: string) => {
  const params = {
    success_url: successUrl,
    error_url: errorUrl,
  };
  return API().get("accounting/auth/url/", { params });
};

/** Get clients for quickbooks service. */
export const getAvailableClients = () => {
  return API().get("accounting/export/customers/");
};
