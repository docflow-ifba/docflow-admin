import { UserRole } from "@/enums/user-role.enum";

export class UserDTO {
  userId: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
}
