import { Organization } from './organization';

export class CreateNoticeDTO {
  noticeId?: string;
  title: string;
  deadline: string;
  pdfBase64: string;
  organization: Organization;
}
