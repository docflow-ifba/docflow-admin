import { Organization } from "./organization";

export class CreateNoticeDTO {
  title: string;
  deadline: string;
  pdfBase64: string;
  organization: Organization;
}
