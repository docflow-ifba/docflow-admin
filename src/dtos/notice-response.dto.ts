import type { NoticeStatus } from "@/enums/notice-status";
import type { Organization } from "./organization";

export class NoticeResponseDTO {
  noticeId: string;
  docflowNoticeId: string;
  title: string;
  deadline: Date;
  organizationId: string;
  views: number;
  status: NoticeStatus;
  organization: Organization;
}
