import CodeDisplayBlock from '@/components/code-display-block';
import { Button } from '@/components/ui/button';
import { ChatBubble, ChatBubbleAction, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat/chat-bubble';
import { ChatInput } from '@/components/ui/chat/chat-input';
import { ChatMessageList } from '@/components/ui/chat/chat-message-list';
import { useEffect, useRef, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import NoticeCard from './NoticeCard';

import { CopyIcon, CornerDownLeft, Mic, Paperclip, Search } from 'lucide-react';

import { MessageDTO } from '@/dtos/message.dto';
import { NoticeResponseDTO } from '@/dtos/notice-response.dto';
import { SenderEnum } from '@/enums/sender.enum';

import { findNotices } from '@/services/notice.service';
import { findConversations } from '@/services/conversation.service';

export default function ChatPage() {
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [notices, setNotices] = useState<NoticeResponseDTO[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<NoticeResponseDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchNotices = async (title: string) => {
    try {
      setLoading(true);
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
    debounceTimeout.current = setTimeout(() => {
      fetchNotices(searchTerm);
    }, 300);
  }, [searchTerm]);

  return (
    <div className="flex h-full w-full">
      <aside className="flex flex-col w-[30%] bg-white border border-gray-200 border-r-0 rounded-tl-md rounded-bl-md">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold tracking-tight mb-6">Chat</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Busque por editais..."
              className="pl-10 w-full rounded-lg border-gray-300 border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center text-gray-500">Carregando...</div>
          ) : notices.length > 0 ? (
            notices.map((notice) => (
              <NoticeCard
                key={notice.noticeId}
                notice={notice}
                isSelected={selectedNotice?.noticeId === notice.noticeId}
                onClick={async () => {
                  setSelectedNotice(notice);
                  try {
                    const conversations = await findConversations(notice.noticeId);
                    if (conversations.length > 0) {
                      // Pegue todas as mensagens da(s) conversa(s) e achate o array
                      const allMessages = conversations.flatMap((c) => c.messages);
                      setMessages(allMessages);
                    } else {
                      setMessages([]);
                    }
                  } catch (err) {
                    console.error('Erro ao buscar conversas:', err);
                    setMessages([]);
                  }
                }}
              />
            ))
          ) : (
            <div className="text-center text-gray-500">Nenhum edital encontrado "{searchTerm}"</div>
          )}
        </div>
      </aside>

      {selectedNotice ? (
        <ChatArea messages={messages} setMessages={setMessages} />
      ) : (
        <div className="flex-1 flex items-center flex-col justify-center bg-white border border-gray-200 rounded-tr-md rounded-br-md">
          <img className="max-w-52" src="/public/logo/logo.png" alt="Logo do DOCFLOW" />
          <p>Selecione um edital para iniciar o chat.</p>
          <div className="px-4 pb-4 w-[70%] mt-4">
            <div className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
              <ChatInput
                disabled={true}
                placeholder="Pergunte alguma coisa"
                className="rounded-lg bg-background border-0 shadow-none focus-visible:ring-0"
              />
              <div className="flex items-center p-3 pt-0">
                <Button variant="ghost" size="icon" disabled={true}>
                  <Paperclip className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" disabled={true}>
                  <Mic className="size-4" />
                </Button>
                <Button disabled={true} type="submit" size="sm" className="ml-auto gap-1.5">
                  Enviar
                  <CornerDownLeft className="size-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ChatArea({
  messages,
  setMessages,
}: {
  messages: MessageDTO[];
  setMessages: React.Dispatch<React.SetStateAction<MessageDTO[]>>;
}) {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const currentAdminMsgRef = useRef<MessageDTO | null>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating && input.trim()) {
        onSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
      }
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    console.log('Pergunta enviada:', input);
    // Lógica de envio para IA pode ser adicionada aqui
  };

  const handleCopy = async (index: number) => {
    const message = messages[index];
    if (message?.sender === SenderEnum.AI) {
      await navigator.clipboard.writeText(message.content);
    }
  };

  return (
    <main className="flex flex-col flex-1 bg-white border border-gray-200 rounded-tr-md rounded-br-md relative">
      <div className="flex-1 overflow-y-auto py-6 px-4" ref={messagesRef}>
        <ChatMessageList>
          {messages.map((message, index) => (
            <ChatBubble key={index} variant={message.sender === SenderEnum.USER ? 'sent' : 'received'}>
              <ChatBubbleAvatar src="" fallback={message.sender === SenderEnum.USER ? '👨🏽' : '🤖'} />
              <ChatBubbleMessage>
                {message.content.split('```').map((part, i) =>
                  i % 2 === 0 ? (
                    <Markdown key={i} remarkPlugins={[remarkGfm]}>
                      {part}
                    </Markdown>
                  ) : (
                    <pre key={i} className="whitespace-pre-wrap pt-2">
                      <CodeDisplayBlock code={part} lang="" />
                    </pre>
                  ),
                )}

                {message.sender === SenderEnum.AI && messages.length - 1 === index && !isGenerating && (
                  <div className="flex items-center mt-1.5 gap-1">
                    <ChatBubbleAction
                      variant="outline"
                      className="size-5"
                      icon={<CopyIcon className="size-3" />}
                      onClick={() => handleCopy(index)}
                    />
                  </div>
                )}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}

          {isGenerating && !currentAdminMsgRef.current && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar src="" fallback="🤖" />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
        </ChatMessageList>
      </div>
      <ChatMessageInput
        formRef={formRef}
        onSubmit={onSubmit}
        input={input}
        setInput={setInput}
        isGenerating={isGenerating}
        onKeyDown={onKeyDown}
        centered={messages.length === 0}
      />
    </main>
  );
}

type ChatMessageInputProps = {
  formRef: React.RefObject<HTMLFormElement | null>;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  input: string;
  setInput: (value: string) => void;
  isGenerating: boolean;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  centered?: boolean;
};

function ChatMessageInput({
  formRef,
  onSubmit,
  input,
  setInput,
  isGenerating,
  onKeyDown,
  centered,
}: ChatMessageInputProps) {
  return (
    <div
      className={`px-4 pb-4 ${
        centered ? 'absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full' : ''
      }`}
    >
      {centered && <p className="text-center text-2xl font-semibold mb-3 text-gray-600">Como posso ajudar?</p>}
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
      >
        <ChatInput
          value={input}
          onKeyDown={onKeyDown}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte alguma coisa"
          className="rounded-lg bg-background border-0 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center p-3 pt-0">
          <Button variant="ghost" size="icon">
            <Paperclip className="size-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Mic className="size-4" />
          </Button>
          <Button disabled={!input || isGenerating} type="submit" size="sm" className="ml-auto gap-1.5">
            Enviar
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
