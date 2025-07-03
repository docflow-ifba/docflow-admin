import { NoticeStatus, NoticeStatusLabels } from '@/enums/notice-status';
import { Clock, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { JSX } from 'react';
import Tooltip from 'rc-tooltip';

export const NoticeStatusIcons: Record<NoticeStatus, JSX.Element> = {
  [NoticeStatus.PENDING]: (
    <Tooltip placement="top" overlay={<span>{NoticeStatusLabels[NoticeStatus.PENDING]}</span>}>
      <Clock className="text-yellow-700 cursor-default" />
    </Tooltip>
  ),
  [NoticeStatus.PROCESSING]: (
    <Tooltip placement="top" overlay={<span>{NoticeStatusLabels[NoticeStatus.PROCESSING]}</span>}>
      <Loader2 className="animate-spin text-blue-700 cursor-default" />
    </Tooltip>
  ),
  [NoticeStatus.PROCESSED]: (
    <Tooltip placement="top" overlay={<span>{NoticeStatusLabels[NoticeStatus.PROCESSED]}</span>}>
      <CheckCircle className="text-green-700 cursor-default" />
    </Tooltip>
  ),
  [NoticeStatus.ERROR]: (
    <Tooltip placement="top" overlay={<span>{NoticeStatusLabels[NoticeStatus.ERROR]}</span>}>
      <XCircle className="text-red-700 cursor-default" />
    </Tooltip>
  ),
} as const;
