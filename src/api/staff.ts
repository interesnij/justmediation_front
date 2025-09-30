import { API } from "helpers";
import { BaseApiSearchParams } from "types";
interface StaffSearchParams extends BaseApiSearchParams {}

/** Number of staff records for the get request. */
const STAFF_PER_PAGE = 20;

/**
 * Get staff users.
 */
export const getStaff = (searchParams: StaffSearchParams) => {
  let params = {
    limit: STAFF_PER_PAGE,
    offset: (searchParams.page || 0) * STAFF_PER_PAGE,
    search: "",
    ordering: "",
  };

  if (searchParams.search != null) {
    params.search = searchParams.search;
  }

  if (searchParams.ordering != null) {
    params.ordering = searchParams.ordering;
  }

  return API().get("users/support/", { params });
};
