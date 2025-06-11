import { CreateNoticeDTO } from '@/dtos/create-notice.dto';
import { api } from '.';
import { NoticeResponseDTO } from '@/dtos/notice-response.dto';

export const findNotices = async (filters: {
  status?: string;
  title?: string;
  organizationId?: string;
  isEmbeded?: boolean;
}): Promise<NoticeResponseDTO[]> => {
  const cleanedFilters = Object.entries(filters)
    .filter(([_, value]) => value !== undefined && value !== null && value !== '')
    .reduce((acc, [key, value]) => {
      acc[key as keyof typeof filters] = value;
      return acc;
    }, {} as typeof filters);

  const response = await api.get('v1/notices', { params: cleanedFilters });
  return response.data;
};

export const createNotice = async (notice: CreateNoticeDTO) => {
  return api.post('v1/notices', notice);
};

export const updateNotice = async (id: string, notice: CreateNoticeDTO) => {
  return api.put(`v1/notices/${id}`, notice);
};

export const deleteNotice = async (id: string) => {
  return api.delete(`v1/notices/${id}`);
};

export const embedNotice = async (docflowNoticeId: string) => {
  return api.post(`v1/notices/embed/${docflowNoticeId}`);
};
