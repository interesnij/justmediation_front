import { ChatInfo } from "./ChatInfo";
import { Network } from "./Network";

/** Group chat between attorneys. */
export interface NetworkChatInfo extends ChatInfo {
  /** Corresponding attorney network. */
  network: Network;
}
