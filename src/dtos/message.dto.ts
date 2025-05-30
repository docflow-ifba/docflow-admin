import { SenderEnum } from "@/enums/sender.enum";
import { ConversationDTO } from "./conversation.entity";

export class MessageDTO {
  messageId: string;
  conversation: ConversationDTO;
  content: string;
  sender: SenderEnum;
  createdAt: Date;
}
