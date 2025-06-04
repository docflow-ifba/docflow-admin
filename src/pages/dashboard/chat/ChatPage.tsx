import { useEffect, useRef, useState, FormEvent, KeyboardEvent } from 'react';
import Markdown from 'react-markdown';
import { CopyIcon, CornerDownLeft, Mic, Paperclip, Search } from 'lucide-react';

import CodeDisplayBlock from '@/components/code-display-block';
import { Button } from '@/components/ui/button';
import { ChatBubble, ChatBubbleAction, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble';
import { ChatInput } from '@/components/ui/chat/chat-input';
import { ChatMessageList } from '@/components/ui/chat/chat-message-list';
import NoticeCard from './NoticeCard';
import ChatMessageInput from './ChatMessageInput';
import ThinkSection from './ThinkSection';

import { NoticeResponseDTO } from '@/dtos/notice-response.dto';
import { ConversationDTO } from '@/dtos/conversation.entity';
import { SenderEnum } from '@/enums/sender.enum';
import { useSocket } from '@/hooks/useSocket';
import { findConversations } from '@/services/conversation.service';
import { findNotices } from '@/services/notice.service';
import { getAvatar } from '@/utils/auth';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<ConversationDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [notices, setNotices] = useState<NoticeResponseDTO[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<NoticeResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);

  const messagesRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const { on, off, emit } = useSocket();

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating && input.trim()) {
        onSubmit(e as unknown as FormEvent<HTMLFormElement>);
      }
    }
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !selectedNotice || isGenerating) return;

    const newMessage: ConversationDTO = {
      content: input,
      sender: SenderEnum.USER,
      createdAt: new Date(),
      notice: selectedNotice,
    };

    setMessages((prev) => [...prev, newMessage]);
    emit('question', { noticeId: selectedNotice.noticeId, prompt: input });
    setInput('');
    setIsGenerating(true);
  };

  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(content);
  };

  const handleIncomingMessage = (message: { conversation: ConversationDTO; done: boolean }) => {
    setIsGenerating(true);
    setMessages((prev) => {
      const last = prev[prev.length - 1];
      if (last?.sender === SenderEnum.AI) {
        return [...prev.slice(0, -1), { ...last, content: message.conversation.content }];
      }
      return [...prev, message.conversation];
    });

    if (message.done) setIsGenerating(false);
    scrollToBottom();
  };

  const handleSelectNotice = async (notice: NoticeResponseDTO) => {
    setSelectedNotice(notice);
    try {
      const conversations = await findConversations(notice.noticeId);
      setMessages(conversations);
      scrollToBottom();
    } catch (err) {
      console.error('Erro ao buscar conversas:', err);
      setMessages([]);
    }
  };

  const fetchNotices = async (title: string) => {
    setLoading(true);
    try {
      const result = await findNotices({ title, isEmbeded: true });
      setNotices(result);
    } catch (error) {
      console.error('Erro ao buscar editais:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => fetchNotices(searchTerm), 300);
  }, [searchTerm]);

  useEffect(() => {
    if (!selectedNotice) return;
    const id = selectedNotice.docflowNoticeId;
    on(id, handleIncomingMessage);
    return () => off(id, handleIncomingMessage);
  }, [selectedNotice, on, off]);

  const renderMessageContent = (content: string) => {
    return content.split('```').map((part, i) => {
      if (i % 2 !== 0) {
        return <CodeDisplayBlock key={i} code={part} lang="" />;
      }
      const sections = part.split(/<\/?think>/g);
      return sections.map((section, idx) =>
        part.includes('<think>') && idx % 2 === 1 ? (
          <ThinkSection key={idx} content={section.trim()} />
        ) : (
          <div className="prose" key={idx}>
            <Markdown>{section}</Markdown>
          </div>
        ),
      );
    });
  };

  return (
    <div className="flex h-full w-full">
      {/* Sidebar */}
      <aside className="w-[30%] flex flex-col bg-white border border-gray-200 border-r-0 rounded-tl-md rounded-bl-md">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold mb-6">Chat</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Busque por editais..."
              className="pl-10 w-full rounded-lg border p-2 text-sm focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center text-gray-500">Carregando...</div>
          ) : notices.length ? (
            notices.map((notice) => (
              <NoticeCard
                key={notice.noticeId}
                notice={notice}
                isSelected={selectedNotice?.noticeId === notice.noticeId}
                onClick={() => handleSelectNotice(notice)}
              />
            ))
          ) : (
            <div className="text-center text-gray-500">Nenhum edital encontrado</div>
          )}
        </div>
      </aside>

      {/* Chat */}
      {selectedNotice ? (
        <main className="flex flex-col flex-1 bg-white border border-gray-200 rounded-tr-md rounded-br-md relative">
          <div className="flex-1 overflow-y-auto py-6 px-4 max-h-[calc(100vh-130px-48px)]" ref={messagesRef}>
            <ChatMessageList>
              {messages.map((message, index) => (
                <ChatBubble key={index} variant={message.sender === SenderEnum.USER ? 'sent' : 'received'}>
                  <ChatBubbleAvatar
                    src={message.sender === SenderEnum.USER ? '' : '/public/logo/logo-img.png'}
                    fallback={message.sender === SenderEnum.USER ? getAvatar() : '🤖'}
                  />
                  <ChatBubbleMessage>
                    {renderMessageContent(message.content)}
                    {message.sender === SenderEnum.AI && index === messages.length - 1 && !isGenerating && (
                      <div className="flex items-center mt-1.5 gap-1">
                        <ChatBubbleAction
                          variant="outline"
                          className="size-5"
                          icon={<CopyIcon className="size-3" />}
                          onClick={() => handleCopy(message.content)}
                        />
                      </div>
                    )}
                  </ChatBubbleMessage>
                </ChatBubble>
              ))}
            </ChatMessageList>
          </div>
          <ChatMessageInput
            formRef={formRef}
            onSubmit={onSubmit}
            input={input}
            setInput={setInput}
            isGenerating={isGenerating}
            onKeyDown={handleKeyDown}
            centered={messages.length === 0}
          />
        </main>
      ) : (
        <main className="flex flex-col flex-1 items-center justify-center bg-white border border-gray-200 rounded-tr-md rounded-br-md">
          <img className="max-w-52" src="/public/logo/logo.png" alt="Logo do DOCFLOW" />
          <p>Selecione um edital para iniciar o chat.</p>
          <div className="w-[70%] px-4 pb-4 mt-4">
            <div className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
              <ChatInput
                disabled
                placeholder="Pergunte alguma coisa"
                className="rounded-lg bg-background border-0 shadow-none focus-visible:ring-0"
              />
              <div className="flex items-center p-3 pt-0">
                <Button variant="ghost" size="icon" disabled>
                  <Paperclip className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" disabled>
                  <Mic className="size-4" />
                </Button>
                <Button disabled type="submit" size="sm" className="ml-auto gap-1.5">
                  Enviar <CornerDownLeft className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
