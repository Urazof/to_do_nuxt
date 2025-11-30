export interface User {
  id?: string
  email: string
  password?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface UserRegisterDto {
  email: string
  password: string
}

export interface UserLoginDto {
  email: string
  password: string
}

export interface UserResponse {
  id: string
  email: string
  createdAt: Date
  updatedAt: Date
}
