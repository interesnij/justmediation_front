import { API } from "helpers";
import {
  AttorneyRegisterDto,
  ParalegalRegisterDto,
  ClientRegisterDto,
  EnterpriseRegisterDto,
  EnterpriseOnboardingDto,
} from "types";

/**
 * Register a user as an attorney.
 * @param registerData Attorney Registration data.
 * @param invite_uuid
 */
export const registerAttorney = async (registerData: AttorneyRegisterDto, invite_uuid) => {
  await API().post("users/attorneys/", registerData, {params: {invite_uuid}});
};

/**
 * Onboard attorney.
 * @param userId Attorney user id.
 * @param userType
 * @param onboardingData attorney onboarding data.
 */
export const onboardUser = async (
  userId: string,
  userType: string,
  onboardingData: AttorneyRegisterDto
) => {
  await API().post(
    `users/${
      userType === "attorney"
        ? "attorneys"
        : userType === "paralegal"
        ? "paralegals"
        : userType === "enterprise" ? "enterprises"
        : userType
    }/${userId}/onboarding/`,
    onboardingData
  );
};

/**
 * Register a users as a client.
 * @param registerData Client registration data.
 * @param invite_uuid
 */
export const registerClient = async (registerData: ClientRegisterDto, invite_uuid) => {
  await API().post("users/clients/", registerData, {params: {invite_uuid}});
};

/**
 * Register paralegal.
 * @param registerData Paralegal registration data.
 * @param invite_uuid
 */
export const registerParalegal = async (registerData: ParalegalRegisterDto, invite_uuid) => {
  await API().post("users/paralegals/", registerData, {params: {invite_uuid}});
};

/**
 * Register law firm.
 * @param registerData Law firm registration data.
 */
export const registerEnterprise = async (
  registerData: EnterpriseRegisterDto
) => {
  await API().post("users/enterprises/", registerData);
};

/**
 * onboard law firm.
 * @param onboardingData Law firm onboarding data.
 */
export const onboardEnterprise = async (
  userId: string,
  onboardingData: EnterpriseOnboardingDto
) => {
  await API().post(`users/enterprises/${userId}/onboarding/`, onboardingData);
};
