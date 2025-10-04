import { AuthorDto } from "./AuthorDto";

/** Matter post dto. */
export interface MatterPostDto {
  /** Identifier */
  id: number;
  /** Topic identifier */
  topic: number;
  /** Author as mediator or client */
  author: AuthorDto;
  /** Text */
  text: string;
  /** Created at */
  created: string;
  /** Modified at */
  modified: string;
}
