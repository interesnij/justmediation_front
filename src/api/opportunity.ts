import { API } from "helpers";

/**
 * Create opportunity object 
 * @param iCreateOpportunity data
 */
 interface iCreateOpportunity {
    client: number;
    attorney: number;
  }
 export const createOpportunity = (data: iCreateOpportunity) => {
  return API().post("business/opportunities/", data);
 };

 /**
 * Delete opportunity object 
 * @param number opportunityId
 */
 export const deleteOpportunity = (opportunityId: number) => {
  return API().delete(`business/opportunities/${opportunityId}/`);
 };