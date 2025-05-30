import { UserDTO } from "./user.dto"

export interface LoginResponse {
  token: string
  user: UserDTO
}