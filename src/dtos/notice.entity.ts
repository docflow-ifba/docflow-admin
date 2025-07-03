import { NoticeStatus } from '@/enums/notice-status';
import { Organization } from './organization';

export class Notice {
  noticeId: string;
  docflowNoticeId: string;
  title: string;
  deadline: Date;
  contentMarkdown: string;
  pdfBase64: string;
  status: NoticeStatus;
  organization: Organization;
}
