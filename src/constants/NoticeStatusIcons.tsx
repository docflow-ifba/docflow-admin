import { NoticeStatus, NoticeStatusLabels } from '@/enums/notice-status';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@radix-ui/react-tooltip';
import { Clock, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { JSX } from 'react';

export const NoticeStatusIcons: Record<NoticeStatus, JSX.Element> = {
  [NoticeStatus.PENDING]: (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Clock className="text-yellow-700" />
        </TooltipTrigger>
        <TooltipContent>{NoticeStatusLabels[NoticeStatus.PENDING]}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  [NoticeStatus.PROCESSING]: (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Loader2 className="animate-spin text-blue-700" />
        </TooltipTrigger>
        <TooltipContent>{NoticeStatusLabels[NoticeStatus.PROCESSING]}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  [NoticeStatus.PROCESSED]: (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <CheckCircle className="text-green-700" />
        </TooltipTrigger>
        <TooltipContent>{NoticeStatusLabels[NoticeStatus.PROCESSED]}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
  [NoticeStatus.ERROR]: (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <XCircle className="text-red-700" />
        </TooltipTrigger>
        <TooltipContent>{NoticeStatusLabels[NoticeStatus.ERROR]}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
} as const;
