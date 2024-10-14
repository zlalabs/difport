import { Injectable } from '@nestjs/common'
import { OrganizationReportCategory, Prisma } from '@prisma/client'
import {
  OrganizationReportCategoryCreateDto,
  OrganizationReportCategoryUpdateDto
} from 'difport/utils/src'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class ReportCategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    organizationId: string,
    page: number,
    limit: number
  ): Promise<OrganizationReportCategory[]> {
    const skip = (page - 1) * limit

    const query = await this.prisma.organizationReportCategory.findMany({
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

  async create(organizationId: string, data: OrganizationReportCategoryCreateDto) {
    const createData: Prisma.OrganizationReportCategoryCreateInput = {
      organization: {
        connect: {
          id: organizationId
        }
      },
      workflow: {
        connect: {
          id: data.workflowId
        }
      },
      name: data.name
    }

    const query = await this.prisma.organizationReportCategory.create({
      data: createData,
      include: {
        organization: true
      }
    })

    return query
  }

  async findById(organizationId: string, id: string) {
    return this.prisma.organizationReportCategory.findFirst({
      where: {
        organizationId: organizationId,
        id: id
      },
      include: {
        organization: true
      }
    })
  }

  async update(organizationId: string, id: string, data: OrganizationReportCategoryUpdateDto) {
    const updateData = {
      organization: {
        connect: {
          id: organizationId
        }
      },
      workflow: {
        connect: {
          id: data.workflowId
        }
      },
      name: data.name
    }

    return this.prisma.organizationReportCategory.update({
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
    return this.prisma.organizationReportCategory.delete({
      where: {
        organizationId: organizationId,
        id: id
      }
    })
  }

  async count(organizationId: string) {
    return await this.prisma.organizationReportCategory.count({
      where: {
        organizationId: organizationId
      }
    })
  }
}
