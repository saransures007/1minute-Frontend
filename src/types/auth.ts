export interface LoginResponse {
  success: boolean;
  needsMobile?: boolean;
  tempUser?: {
    name: string;
    email: string;
    image?: string;
    provider: string;
    providerId: string;
  };
  user?: any;
}