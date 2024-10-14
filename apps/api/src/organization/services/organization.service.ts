import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import {
  ORGANIZATION_ROLE,
  OrganizationCreateDto,
  OrganizationUpdateDto,
  OrganizationViewDto
} from 'difport/utils'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class OrganizationService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, page: number, limit: number): Promise<OrganizationViewDto[]> {
    const skip = (page - 1) * limit

    const query = await this.prisma.organization.findMany({
      skip: skip,
      take: limit,
      where: {
        teams: {
          every: {
            userId: userId
          }
        }
      },
      include: {
        teams: {
          include: {
            user: {
              omit: {
                password: true
              }
            }
          }
        }
      }
    })

    return query
  }

  async create(userId: string, data: OrganizationCreateDto) {
    const createData: Prisma.OrganizationCreateInput = {
      name: data.name,
      teams: {
        create: {
          userId: userId,
          role: ORGANIZATION_ROLE.OWNER
        }
      }
    }

    return await this.prisma.organization.create({
      data: createData,
      include: {
        teams: true
      }
    })
  }

  async findById(id: string) {
    return this.prisma.organization.findFirst({
      where: {
        id: id
      },
      include: {
        teams: {
          include: {
            user: {
              omit: {
                password: true
              }
            }
          }
        }
      }
    })
  }

  async update(id: string, data: OrganizationUpdateDto) {
    return this.prisma.organization.update({
      where: {
        id: id
      },
      data: data
    })
  }

  async remove(id: string) {
    const now = dayjs().toDate()
    return this.prisma.organization.update({
      where: {
        id: id
      },
      data: {
        deletedAt: now
      }
    })
  }

  async count() {
    return await this.prisma.organization.count()
  }
}
