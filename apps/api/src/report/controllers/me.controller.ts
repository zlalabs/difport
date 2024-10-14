import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Put,
  Query,
  Req,
  Res
} from '@nestjs/common'
import { IResponseData, IResponsePaginate, ReportUpdateDto, ReportViewDto } from 'difport/utils'
import { Response } from 'express'
import { IRequestWithUser } from '../../auth/request.interface'
import { ReportService } from '../services/report.service'

@Controller('reports/me')
export class MeController {
  constructor(private readonly reportService: ReportService) {}

  @Get('')
  async findByMe(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Param('organizationId') organizationId: string
  ) {
    const currentPage = page || 1
    const perPage = limit || 20

    const userId = req!.user!.id
    const query = await this.reportService.findByUser(organizationId, userId, currentPage, perPage)
    const total = await this.reportService.countByUser(organizationId, userId)
    const response: IResponsePaginate<ReportViewDto[]> = {
      success: true,
      total: total,
      currentPage: currentPage,
      perPage: perPage,
      data: query as ReportViewDto[]
    }
    return res.status(HttpStatus.OK).json(response)
  }

  @Put('')
  async update(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Param('organizationId') organizationId: string,
    @Body() body: ReportUpdateDto
  ) {
    const userId = req!.user!.id
    const query = await this.reportService.findById(organizationId, userId)
    if (!query) {
      throw new NotFoundException('id not found')
    }
    await this.reportService.update(organizationId, userId, body)
    const booking = await this.reportService.findById(organizationId, userId)
    const response: IResponseData<ReportViewDto> = {
      data: booking as ReportViewDto,
      success: true
    }

    return res.status(HttpStatus.OK).json(response)
  }

  @Delete('')
  async remove(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Param('organizationId') organizationId: string
  ) {
    const userId = req!.user!.id
    await this.reportService.remove(organizationId, userId)
    const response: IResponseData<string> = {
      message: 'Delete successfully',
      success: true
    }
    return res.status(HttpStatus.OK).json(response)
  }
}
