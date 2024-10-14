import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'
import { IAuthUserRequest, IAutUserResponse, IUserPayload } from 'difport/utils'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(auth: IAuthUserRequest): Promise<IAutUserResponse> {
    const user = await this.prisma.user.findFirst({
      where: {
        username: auth.username,
        deletedAt: null
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true
      }
    })
    if (!user) throw new Error('User not found.')

    const match = await compare(auth.password, user.password)
    if (!match) throw new Error('Password incorrect.')

    if (user && match) {
      const payload: IUserPayload = {
        username: user.username,
        sub: user.id,
        id: user.id
      }

      const token = await this.jwtService.sign(payload)

      const res: IAutUserResponse = {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName
        },
        accessToken: token
      }
      return res
    }
  }

  async findByAuthUser(id: string, username: string) {
    return this.prisma.user.findFirst({
      where: {
        id: id,
        username: username
      }
    })
  }
}
