import { House } from './house.model';

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  houseId: string;
}

export interface CreateAdminUserRequest {
  name: string;
  email: string;
  password: string;
  house: {
    name: string;
    imagePath?: string;
  };
}

export interface CreateAdminUserResponse {
  user: User;
  house: House;
}
