import { UserDTO, UserUpdateDTO } from '@/dtos/user.dto';
import { api } from '.';

export const updateUser = async (id: string, body: UserUpdateDTO): Promise<UserDTO> => {
  const response = await api.put<UserDTO>(`v1/users/${id}`, body);

  return response.data;
};

export const getUser = async (id: string): Promise<UserDTO> => {
  const response = await api.get<UserDTO>(`v1/users/${id}`);
  return response.data;
};
