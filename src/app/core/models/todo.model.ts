export interface TodoModel {
  id: string;
  title: string;
  createdAt: string;
  expirationDate: string;
  expirationTime?: string;
  favorite: boolean;
}
