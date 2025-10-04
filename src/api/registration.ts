import { API } from "helpers";
import {
  MediatorRegisterDto,
  ParalegalRegisterDto,
  ClientRegisterDto,
  EnterpriseRegisterDto,
  EnterpriseOnboardingDto,
} from "types";

/**
 * Register a user as an Mediator.
 * @param registerData Mediator Registration data.
 * @param invite_uuid
 */
export const registerMediator = async (registerData: MediatorRegisterDto, invite_uuid) => {
  await API().post("users/mediators/", registerData, {params: {invite_uuid}});
};

/**
 * Onboard Mediator.
 * @param userId Mediator user id.
 * @param userType
 * @param onboardingData Mediator onboarding data.
 */
export const onboardUser = async (
  userId: string,
  userType: string,
  onboardingData: MediatorRegisterDto
) => {
  await API().post(
    `users/${
      userType === "mediator"
        ? "mediators"
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
