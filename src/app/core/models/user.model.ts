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
  user: {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    houseId: string;
  };
  house: {
    id: string;
    name: string;
    imagePath: string | null;
  };
}
