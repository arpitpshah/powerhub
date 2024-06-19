export interface User {
    id?: string;
    username?: string;
    name: string;
    initials: string;
    userId?:string;
    token?:string;
    role?:string;
  }

  export interface AuthState {
    isLoggedIn: boolean;
    user: User | null;
  }
  
  interface UserData {
    emailId: string;
    firstName: string;
    lastName: string;
    password?:string;
    role?: string;
    userId?: string;
  }