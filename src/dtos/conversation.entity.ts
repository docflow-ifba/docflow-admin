import { MessageDTO } from './message.dto';
import { NoticeResponseDTO } from './notice-response.dto';
import { UserDTO } from './user.dto';

export class ConversationDTO {
  conversationId: string;
  notice: NoticeResponseDTO;
  user: UserDTO;
  messages: MessageDTO[];
}
