import { LoginResponse } from "@/dtos/login-response.dto";
import { api } from ".";
import { LoginRequest } from "@/dtos/login-request.dto";

export const login = async ({ email, password }: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('v1/auth/login', {
    email,
    password,
  })

  return response.data
}
