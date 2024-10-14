import { Injectable } from '@nestjs/common'
import { Prisma, User } from '@prisma/client'
import { hashSync } from 'bcrypt'
import dayjs from 'dayjs'
import { UserCreateDto, UserUpdateDto } from 'difport/utils'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, limit: number): Promise<User[]> {
    const skip = (page - 1) * limit

    const users = await this.prisma.user.findMany({
      skip: skip,
      take: limit
    })

    return users
  }

  async create(data: UserCreateDto) {
    const password = hashSync(data.password, 10)
    const createUser: Prisma.UserCreateInput = {
      ...data,
      password: password,
      failLoginCount: 0,
      email: null
    }

    return await this.prisma.user.create({
      select: {
        id: true,
        username: true,
        firstName: true,
        lastName: true,
        email: true,
        mobile: true
      },
      data: createUser
    })
  }

  async findById(id: string) {
    return this.prisma.user.findFirst({
      where: {
        id: id
      }
    })
  }

  async update(id: string, data: UserUpdateDto) {
    return this.prisma.user.update({
      where: {
        id: id
      },
      data: data
    })
  }

  async remove(id: string) {
    const now = dayjs().toDate()
    return this.prisma.user.update({
      where: {
        id: id
      },
      data: {
        deletedAt: now
      }
    })
  }

  async count() {
    return await this.prisma.user.count()
  }
}
