import { Injectable } from '@nestjs/common'
import { OrganizationWorkflow, Prisma } from '@prisma/client'

import { OrganizationWorkflowCreateDto, OrganizationWorkflowUpdateDto } from 'difport/utils'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class WorkflowService {
  constructor(private prisma: PrismaService) {}

  async findAll(
    organizationId: string,
    page: number,
    limit: number
  ): Promise<OrganizationWorkflow[]> {
    const skip = (page - 1) * limit

    const query = await this.prisma.organizationWorkflow.findMany({
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

  async create(organizationId: string, data: OrganizationWorkflowCreateDto) {
    const createData: Prisma.OrganizationWorkflowCreateInput = {
      ...data,
      organization: {
        connect: {
          id: organizationId
        }
      }
    }

    const createWorkspace = await this.prisma.organizationWorkflow.create({
      data: createData
    })

    return createWorkspace
  }

  async findById(organizationId: string, id: string) {
    return this.prisma.organizationWorkflow.findFirst({
      where: {
        organizationId: organizationId,
        id: id
      },
      include: {
        organization: true
      }
    })
  }

  async update(organizationId: string, id: string, data: OrganizationWorkflowUpdateDto) {
    return this.prisma.organizationWorkflow.update({
      where: {
        organizationId: organizationId,
        id: id
      },
      data: data
    })
  }

  async remove(organizationId: string, id: string) {
    return this.prisma.organizationWorkflow.delete({
      where: {
        organizationId: organizationId,
        id: id
      }
    })
  }

  async count(organizationId: string) {
    return await this.prisma.organizationWorkflow.count({
      where: {
        organizationId: organizationId
      }
    })
  }
}
