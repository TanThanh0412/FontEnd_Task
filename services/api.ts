import httpClient from '@/utils/httpClient';
import {  Sort, Status } from '../types';
import { UserLoginResponse } from '@/context/AuthContext';

export interface SignInRequest {
  userName: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
}

export interface TaskRequest {
  id?: string;
  title: string;
  description: string;
  status: Status;
  dueDate: string;
}

export interface ModifyTaskStatusRequest {
  id: string;
  status: Status;
}

// Auth functions
export const login = async (request: SignInRequest) : Promise<UserLoginResponse> => {
  const response: UserLoginResponse = await httpClient.post("/users/signin", request)
  return response;
};

//Register 
export const register = async (request: RegisterRequest) => {
  const response = await httpClient.post("/users", request)
  return response;
};

//Get list task 
export const getTasks = async (order: Sort)=> {
  const response = await httpClient.get(`/tasks?order=${order}`)
  return response;
};

//Create task
export const createTask = async (request: TaskRequest) => {
  const response = await httpClient.post("/tasks", request)
  return response;
};

//Update task
export const updateTask = async (id: string, request: TaskRequest)=> {
  const updateRequest = {...request, id}
  const response = await httpClient.put("/tasks", updateRequest)
  return response;
};

//Update task status
export const updateTaskStatus = async (request: ModifyTaskStatusRequest)=> {
  const response = await httpClient.put("/tasks/status", request)
  return response;
};

//Delete task
export const deleteTask = async (id:string) => {
  const response = await httpClient.delete(`/tasks/${id}`);
  return response;
};