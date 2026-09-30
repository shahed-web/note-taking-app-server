import { UserRole } from "./user.model";

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  interests?: string[];
}