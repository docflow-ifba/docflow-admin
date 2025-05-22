export enum NoticeStatus {
    PENDING_EMBEDDING = 'PENDING_EMBEDDING',
    EMBEDDED = 'EMBEDDED',
}

export const NoticeStatusLabels: Record<NoticeStatus, string> = {
    [NoticeStatus.PENDING_EMBEDDING]: 'Pendente de Embedding',
    [NoticeStatus.EMBEDDED]: 'Embedado',
};