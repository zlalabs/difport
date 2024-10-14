import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  Res
} from '@nestjs/common'
import { IResponseData, IResponsePaginate, ReportCreateDto, ReportViewDto } from 'difport/utils'
import { Response } from 'express'
import { Public } from '../../auth/decorators/public.decorator'
import { IRequestWithUser } from '../../auth/request.interface'
import { ReportService } from '../services/report.service'

@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  async create(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Param('organizationId') organizationId: string,
    @Body() body: ReportCreateDto
  ) {
    try {
      const userId = req!.user!.id
      const query = await this.reportService.create(userId, body)
      const response: IResponseData<ReportViewDto> = {
        data: query as ReportViewDto,
        success: true
      }
      res.status(HttpStatus.OK).json(response)
    } catch (error) {
      const msg: IResponseData<string> = {
        message: error?.message,
        success: false
      }
      throw new HttpException(msg, HttpStatus.FORBIDDEN)
    }
  }

  @Public()
  @Get()
  async findAll(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Param('organizationId') organizationId: string
  ) {
    const currentPage = page || 1
    const perPage = limit || 20

    const query = await this.reportService.findAll(organizationId, currentPage, perPage)
    const total = await this.reportService.count(organizationId)
    const response: IResponsePaginate<ReportViewDto[]> = {
      success: true,
      total: total,
      currentPage: currentPage,
      perPage: perPage,
      data: query as ReportViewDto[]
    }
    return res.status(HttpStatus.OK).json(response)
  }

  @Public()
  @Get(':id')
  async findById(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Param('organizationId') organizationId: string,
    @Param('id') id: string
  ) {
    const query = await this.reportService.findById(organizationId, id)
    if (!query) {
      throw new NotFoundException('id not found')
    }
    const response: IResponseData<ReportViewDto> = {
      data: query as ReportViewDto,
      success: true
    }

    return res.status(HttpStatus.OK).json(response)
  }
}
