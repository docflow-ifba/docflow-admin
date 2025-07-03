import { NoticeResponseDTO } from '@/dtos/notice-response.dto';
import { clearConversations } from '@/services/conversation.service';
import { formatDate } from '@/utils/date';
import { BookOpen, Trash2 } from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';
import Tooltip from 'rc-tooltip';

interface NoticeCardProps {
  notice: NoticeResponseDTO;
  isSelected: boolean;
  onClick: () => void;
  unselect: () => void;
}

const NoticeCard: React.FC<NoticeCardProps> = ({ notice, isSelected, onClick, unselect }) => {
  const handleClearConversations = async () => {
    try {
      await clearConversations(notice.noticeId);
      unselect();
      toast.success('Histórico de conversas limpo com sucesso');
    } catch (error) {
      console.error('Erro ao limpar histórico de conversas:', error);
      toast.error('Erro ao limpar histórico de conversas');
    }
  };

  return (
    <div
      className={`flex justify-between items-center p-4 mb-4 rounded-xl border transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'border-primary/40 bg-primary/5'
          : 'border-gray-200 bg-white hover:border-primary/20 hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary/25' : 'bg-gray-100'}`}>
          <BookOpen className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-gray-500'}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 line-clamp-2">{notice.title}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {formatDate(notice.deadline)} • {notice.organization.name}
          </p>
        </div>
      </div>
      <Tooltip placement="top" overlay={<p>Limpar histórico</p>}>
        <div className="w-8 h-8 hover:bg-gray-100 flex items-center justify-center rounded-full transition-colors duration-200">
          <Trash2 className="w-4 h-4" onClick={handleClearConversations} />
        </div>
      </Tooltip>
    </div>
  );
};

export default NoticeCard;
