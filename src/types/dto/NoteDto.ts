import { ClientDto } from "./ClientDto";
import { MatterDto } from "./MatterDto";

/** Note dto model. */
export interface NoteDto {
  /** Id. */
  id?: number;
  /** Title. */
  title: string;
  /** Text. */
  text: string;
  /** Matter. */
  matter: number;
  /** Matter data. */
  matter_data?: MatterDto;
  /** Created by. */
  created_by?: number;
  /** Created by data. */
  created_by_data?: ClientDto;
  /** Created. */
  created?: string;
  /** Modified. */
  modified?: string;
}
