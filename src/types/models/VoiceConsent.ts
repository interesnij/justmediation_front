import { JusLawFile } from "./JuslawFile";
import { Matter } from "./Matter";

/** Voice consent for the matter. */
export interface VoiceConsent<FileType = string | File>
  extends JusLawFile<FileType> {
  /** Voice consent id. */
  id: number;
  /** Matter consent belongs to. */
  matterData: Pick<Matter, "id" | "code" | "title" | "description">;
  /** Audio file.. */
  file: FileType;
  /** Consent title */
  title: string;
}
