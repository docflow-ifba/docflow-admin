export enum NoticeStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PROCESSED = 'PROCESSED',
  ERROR = 'ERROR',
}

export const NoticeStatusLabels: Record<NoticeStatus, string> = {
  [NoticeStatus.PENDING]: 'Pendente',
  [NoticeStatus.PROCESSING]: 'Processando',
  [NoticeStatus.PROCESSED]: 'Processado',
  [NoticeStatus.ERROR]: 'Erro',
};
