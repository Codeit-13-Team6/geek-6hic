export interface User {
  id: number;
  teamId: string;
  email: string;
  name: string;
  companyName: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}


export interface UserProfileUpdateProps {
  name: string;
  email?: string;
  companyName: string;
  image?: string | null;
}
