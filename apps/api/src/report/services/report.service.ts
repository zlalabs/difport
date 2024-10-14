import { Injectable } from '@nestjs/common'
import { Prisma, Report } from '@prisma/client'

import { REPORT_STATUS, ReportCreateDto } from 'difport/utils'
import { ReportUpdateDto } from 'difport/utils/src'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async findAll(organizationId: string, page: number, limit: number): Promise<Report[]> {
    const skip = (page - 1) * limit

    const query = await this.prisma.report.findMany({
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

  async create(userId: string, data: ReportCreateDto) {
    const createData: Prisma.ReportCreateInput = {
      organization: {
        connect: {
          id: data.organizationId
        }
      },
      user: {
        connect: {
          id: userId
        }
      },
      reportCategory: {
        connect: {
          id: data.categoryId
        }
      },
      title: data.title,
      description: data.description,
      mapLat: data.mapLat,
      mapLng: data.mapLng,
      reportLevel: 1,
      step: 1,
      status: REPORT_STATUS.WAITING,
      published: data.published
    }

    const query = await this.prisma.report.create({
      data: createData
    })

    return query
  }

  async findById(organizationId: string, id: string) {
    return this.prisma.report.findFirst({
      where: {
        organizationId: organizationId,
        id: id
      },
      include: {
        organization: true
      }
    })
  }

  async update(organizationId: string, id: string, data: ReportUpdateDto) {
    return this.prisma.report.update({
      where: {
        organizationId: organizationId,
        id: id
      },
      data: data
    })
  }

  async remove(organizationId: string, id: string) {
    return this.prisma.report.delete({
      where: {
        organizationId: organizationId,
        id: id
      }
    })
  }

  async count(organizationId: string) {
    return await this.prisma.report.count({
      where: {
        organizationId: organizationId
      }
    })
  }

  async findByUser(organizationId: string, userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit

    const query = await this.prisma.report.findMany({
      skip: skip,
      take: limit,
      where: {
        organizationId: organizationId,
        userId: userId
      },
      include: {
        organization: true
      }
    })

    return query
  }

  async countByUser(organizationId: string, userId: string) {
    return await this.prisma.report.count({
      where: {
        organizationId: organizationId,
        userId: userId
      }
    })
  }
}
