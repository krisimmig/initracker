export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserState {
  user: firebase.User | null;
}
