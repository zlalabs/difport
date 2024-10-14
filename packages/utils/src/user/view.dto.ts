export class UserViewDto {
  id: string

  firstName?: string

  lastName?: string

  email?: string

  username: string

  password: string

  mobile?: string

  failLoginCount: number

  lastLogin?: Date

  createdAt: Date

  updatedAt: Date

  deletedAt?: Date
}
