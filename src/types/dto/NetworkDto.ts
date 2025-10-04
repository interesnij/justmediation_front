// import { MediatorDto } from "./MediatorDto";

/** Group chat DTO. */
export interface NetworkDto {
  /** Id. */
  id?: number;
  /** Title. */
  title: string;
  /** Chat channel id. */
  chat_channel?: string;
  /** Creator id. */
  creator?: number;
  /** Creator. */
  // creator_data?: MediatorDto;
  /** participants */
  participants: number[];
  /** Participants objects. */
  // participants_data?: MediatorDto[];
}
