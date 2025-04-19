export type User = {
  id: string;
  userName: string;
  password: string;
  email: string;
};

export type TaskStatus = 'todo' | 'in-process' | 'done';

export enum Status {
  ToDo = 0,
  InProgress = 1,
  Complete = 2
}

export enum Sort {
  Ascending = 0,
  Descending = 1
}

export type Task = {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: Status;
  dueDate: string;
};

export type ResponseType = {
  data: [];
  message?: string;
  isSuccess: boolean;
}