import { Request } from "express";

export interface RequestWithUser extends Request {
  user?: {
    user: IUser;
  };
}

export interface IUser {
  client_id: number;
  name: string;
  surname: string;
  email: string;
  created_on: string;
  last_login: null | string;
}
