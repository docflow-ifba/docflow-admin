import { SenderEnum } from '@/enums/sender.enum';
import { NoticeResponseDTO } from './notice-response.dto';
import { UserDTO } from './user.dto';

export class ConversationDTO {
  conversationId?: string;
  content: string;
  sender: SenderEnum;
  notice: NoticeResponseDTO;
  createdAt: Date;
  user?: UserDTO;
}
