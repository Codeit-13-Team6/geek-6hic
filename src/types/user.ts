export interface UserProfileUpdateProps {
  name: string;
  email?: string;
  companyName: string;
  image?: string | null;
}

export interface User extends UserProfileUpdateProps {
  id: number;
  teamId: string;
  createdAt: string;
  updatedAt: string;
}
