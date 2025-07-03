import { useState } from 'react';
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage, ChatBubbleAction } from '@/components/ui/chat/chat-bubble';
import { CopyIcon, CheckIcon } from 'lucide-react';
import { SenderEnum } from '@/enums/sender.enum';
import CodeDisplayBlock from '@/components/code-display-block';
import ThinkSection from './ThinkSection';
import { ConversationDTO } from '@/dtos/conversation.entity';
import { useAuth } from '@/contexts/AuthContext';
import MarkdownRenderer from '../notices/MarkdownRenderer';
import MessageLoading from '@/components/ui/chat/message-loading';

interface ChatMessageBubbleProps {
  message: ConversationDTO;
  isGenerating: boolean;
}

export default function ChatMessageBubble({ message, isGenerating }: ChatMessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const { getAvatar } = useAuth();

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderMessageContent = (content: string) => {
    if (!content) return <MessageLoading color="text-primary" />;
    return content.split('```').map((part, i) => {
      if (i % 2 !== 0) {
        return <CodeDisplayBlock key={i} code={part} lang="" />;
      }
      const sections = part.split(/<\/?think>/g);
      return sections.map((section, idx) =>
        part.includes('<think>') && idx % 2 === 1 ? (
          <ThinkSection key={idx} content={section.trim()} />
        ) : (
          <MarkdownRenderer markdown={section} />
        ),
      );
    });
  };

  return (
    <ChatBubble variant={message.sender === SenderEnum.USER ? 'sent' : 'received'} className="relative group">
      <ChatBubbleAvatar
        src={message.sender === SenderEnum.USER ? '' : '/public/logo/logo-img.png'}
        fallback={message.sender === SenderEnum.USER ? getAvatar() : '🤖'}
      />
      <ChatBubbleMessage>
        {message.sender === SenderEnum.AI ? renderMessageContent(message.content) : message.content}
        {message.sender === SenderEnum.AI && !isGenerating && (
          <div className="flex items-center mt-1.5 gap-1 absolute left-12 opacity-0 group-hover:opacity-100 transition-opacity">
            <ChatBubbleAction
              variant="outline"
              className="size-5"
              icon={copied ? <CheckIcon className="size-3" /> : <CopyIcon className="size-3" />}
              onClick={() => handleCopy(message.content)}
            />
          </div>
        )}
      </ChatBubbleMessage>
    </ChatBubble>
  );
}
