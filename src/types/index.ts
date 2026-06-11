export interface User {
  id: string;
  name: string;
  email: string;
  role: any;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Role {
  id: string;
  name: string;
}