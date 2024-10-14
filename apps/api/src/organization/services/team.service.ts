import { Injectable } from '@nestjs/common'
import { OrganizationTeam, Prisma } from '@prisma/client'
import { TeamCreateDto, TeamUpdateDto } from 'difport/utils/src'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  async findAll(organizationId: string, page: number, limit: number): Promise<OrganizationTeam[]> {
    const skip = (page - 1) * limit

    const query = await this.prisma.organizationTeam.findMany({
      skip: skip,
      take: limit,
      where: {
        organizationId: organizationId
      },
      include: {
        organization: true
      }
    })

    return query
  }

  async create(organizationId: string, data: TeamCreateDto) {
    const createData: Prisma.OrganizationTeamCreateInput = {
      organization: {
        connect: {
          id: organizationId
        }
      },
      user: {
        connect: {
          id: data.userId
        }
      },
      role: data.role
    }

    const query = await this.prisma.organizationTeam.create({
      data: createData,
      include: {
        organization: true
      }
    })

    return query
  }

  async findById(organizationId: string, id: string) {
    return this.prisma.organizationTeam.findFirst({
      where: {
        organizationId: organizationId,
        id: id
      },
      include: {
        organization: true
      }
    })
  }

  async update(organizationId: string, id: string, data: TeamUpdateDto) {
    const updateData: Prisma.OrganizationTeamUpdateInput = {
      role: data.role
    }

    return this.prisma.organizationTeam.update({
      where: {
        organizationId: organizationId,
        id: id
      },
      data: updateData,
      include: {
        organization: true
      }
    })
  }

  async remove(organizationId: string, id: string) {
    return this.prisma.organizationTeam.delete({
      where: {
        organizationId: organizationId,
        id: id
      }
    })
  }

  async count(organizationId: string) {
    return await this.prisma.organizationTeam.count({
      where: {
        organizationId: organizationId
      }
    })
  }

  async findByUser(organizationId: string, userId: string) {
    return this.prisma.organizationTeam.findFirst({
      where: {
        organizationId: organizationId,
        userId: userId
      },
      include: {
        organization: true
      }
    })
  }
}
