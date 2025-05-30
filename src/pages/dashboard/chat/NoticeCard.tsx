import { NoticeResponseDTO } from '@/dtos/notice-response.dto';
import { formatDate } from '@/utils/date';
import { BookOpen } from 'lucide-react';
import React from 'react';

interface NoticeCardProps {
  notice: NoticeResponseDTO;
  isSelected: boolean;
  onClick: () => void;
}

const NoticeCard: React.FC<NoticeCardProps> = ({ notice, isSelected, onClick }) => {
  return (
    <div
      className={`p-4 mb-4 rounded-xl border transition-all duration-300 cursor-pointer hover:shadow-md ${
        isSelected ? 'border-primary/40 bg-primary/5' : 'border-gray-200 bg-white hover:border-primary/20'
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
    </div>
  );
};

export default NoticeCard;
