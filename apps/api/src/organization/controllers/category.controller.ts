import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards
} from '@nestjs/common'
import {
  IResponseData,
  IResponsePaginate,
  ORGANIZATION_ROLE,
  OrganizationReportCategoryCreateDto,
  OrganizationReportCategoryUpdateDto,
  OrganizationReportCategoryViewDto
} from 'difport/utils'
import { Response } from 'express'
import { Roles } from '../../auth/decorators/role.decorator'
import { OrganizationAccess } from '../../auth/guards/organization.guard'
import { IRequestWithUser } from '../../auth/request.interface'
import { ReportCategoryService } from '../services/category.service'

@UseGuards(OrganizationAccess)
@Roles(
  ORGANIZATION_ROLE.OWNER,
  ORGANIZATION_ROLE.ADMIN,
  ORGANIZATION_ROLE.MANAGER,
  ORGANIZATION_ROLE.STAFF
)
@Controller('organizations/:organizationId/categories')
export class ReportCategoryController {
  constructor(private readonly reportCategoryService: ReportCategoryService) {}

  @Post()
  async create(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Param('organizationId') organizationId: string,
    @Body() body: OrganizationReportCategoryCreateDto
  ) {
    try {
      const query = await this.reportCategoryService.create(organizationId, body)
      const response: IResponseData<OrganizationReportCategoryViewDto> = {
        data: query as OrganizationReportCategoryViewDto,
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

    const query = await this.reportCategoryService.findAll(organizationId, currentPage, perPage)
    const total = await this.reportCategoryService.count(organizationId)
    const response: IResponsePaginate<OrganizationReportCategoryViewDto[]> = {
      success: true,
      total: total,
      currentPage: currentPage,
      perPage: perPage,
      data: query as OrganizationReportCategoryViewDto[]
    }
    return res.status(HttpStatus.OK).json(response)
  }

  @Get(':id')
  async findById(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Param('organizationId') organizationId: string,
    @Param('id') id: string
  ) {
    const query = await this.reportCategoryService.findById(organizationId, id)
    if (!query) {
      throw new NotFoundException('id not found')
    }
    const response: IResponseData<OrganizationReportCategoryViewDto> = {
      data: query as OrganizationReportCategoryViewDto,
      success: true
    }

    return res.status(HttpStatus.OK).json(response)
  }

  @Put(':id')
  async update(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Param('organizationId') organizationId: string,
    @Param('id') id: string,
    @Body() body: OrganizationReportCategoryUpdateDto
  ) {
    const query = await this.reportCategoryService.findById(organizationId, id)
    if (!query) {
      throw new NotFoundException('id not found')
    }
    await this.reportCategoryService.update(organizationId, id, body)
    const booking = await this.reportCategoryService.findById(organizationId, id)
    const response: IResponseData<OrganizationReportCategoryViewDto> = {
      data: booking as OrganizationReportCategoryViewDto,
      success: true
    }

    return res.status(HttpStatus.OK).json(response)
  }

  @Delete(':id')
  async remove(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Param('organizationId') organizationId: string,
    @Param('id') id: string
  ) {
    await this.reportCategoryService.remove(organizationId, id)
    const response: IResponseData<string> = {
      message: 'Delete successfully',
      success: true
    }
    return res.status(HttpStatus.OK).json(response)
  }
}
