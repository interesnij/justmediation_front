import { ClientDto } from "./ClientDto";

/**
 * Client registration DTO.
 */
export interface ClientRegistrationDto extends ClientDto {
  /**
   * Password.
   */
  password1: string;
  /**
   * Password confirmation.
   */
  password2: string;
  /**
   * Invite identifier.
   */
  invite?: string;
}
