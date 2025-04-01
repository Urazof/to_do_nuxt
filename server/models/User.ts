interface User {
  email: string
  password: string
}

const users: User[] = []

export const createUser = (user: User) => {
  if (users.some(u => u.email === user.email)) {
    throw new Error('Email already registered')
  }
  users.push(user)
  return user
}

export const findUserByEmail = (email: string) => {
  return users.find(u => u.email === email)
}
