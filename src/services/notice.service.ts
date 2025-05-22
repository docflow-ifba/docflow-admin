import { CreateNoticeDTO } from "@/dtos/create-notice.dto";
import { api } from ".";
import { NoticeResponseDTO } from "@/dtos/notice-response.dto";

export const findNotices = async (status: string, title: string, organizationId: string): Promise<NoticeResponseDTO[]> => {
  const response = await api.get("/api/v1/notices", {
    params: {
      status,
      title,
      organizationId,
    },
  });
  return response.data;
};

export const createNotice = async (notice: CreateNoticeDTO) => {
  return api.post("/api/v1/notices", notice);
};

export const updateNotice = async (id: string, notice: CreateNoticeDTO) => {
  return api.put(`/api/v1/notices/${id}`, notice);
};

export const deleteNotice = async (id: string) => {
  return api.delete(`/api/v1/notices/${id}`);
};

export const embedNotice = async (docflowNoticeId: string) => {
  return api.post(`/api/v1/notices/embed/${docflowNoticeId}`);
};
