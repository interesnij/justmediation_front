import { ChatInfo } from "./ChatInfo";
import { Network } from "./Network";

/** Group chat between mediators. */
export interface NetworkChatInfo extends ChatInfo {
  /** Corresponding mediator network. */
  network: Network;
}
