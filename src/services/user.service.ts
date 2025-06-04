import { UserDTO, UserUpdateDTO } from '@/dtos/user.dto';
import { api } from '.';

export const updateUser = async (body: UserUpdateDTO): Promise<UserDTO> => {
  const response = await api.put<UserDTO>('v1/user', body);

  return response.data;
};
