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
import { Organization } from '@prisma/client'
import {
  IResponseData,
  IResponsePaginate,
  ORGANIZATION_ROLE,
  OrganizationCreateDto,
  OrganizationUpdateDto,
  OrganizationViewDto
} from 'difport/utils'
import { Response } from 'express'
import { Roles } from '../../auth/decorators/role.decorator'
import { RolesGuard } from '../../auth/guards/role.guard'
import { IRequestWithUser } from '../../auth/request.interface'
import { OrganizationService } from '../services/organization.service'

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  async create(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Body() body: OrganizationCreateDto
  ) {
    try {
      const userId = req!.user!.id
      const query = await this.organizationService.create(userId, body)
      const response: IResponseData<Organization> = {
        data: query,
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
    @Query('limit') limit: number
  ) {
    const currentPage = page || 1
    const perPage = limit || 20
    const userId = req!.user!.id

    const query = await this.organizationService.findAll(userId, currentPage, perPage)
    const total = await this.organizationService.count()

    const response: IResponsePaginate<OrganizationViewDto[]> = {
      success: true,
      total: total,
      currentPage: currentPage,
      perPage: perPage,
      data: query
    }
    return res.status(HttpStatus.OK).json(response)
  }

  @Get(':organizationId')
  async findById(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Param('organizationId') organizationId: string
  ) {
    const query = await this.organizationService.findById(organizationId)
    if (!query) {
      throw new NotFoundException('id not found')
    }
    const response: IResponseData<Organization> = {
      data: query,
      success: true
    }

    return res.status(HttpStatus.OK).json(response)
  }

  @UseGuards(RolesGuard)
  @Roles(ORGANIZATION_ROLE.OWNER, ORGANIZATION_ROLE.ADMIN)
  @Put(':organizationId')
  async update(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Param('organizationId') organizationId: string,
    @Body() body: OrganizationUpdateDto
  ) {
    const query = await this.organizationService.findById(organizationId)
    if (!query) {
      throw new NotFoundException('id not found')
    }
    await this.organizationService.update(organizationId, body)
    const booking = await this.organizationService.findById(organizationId)
    const response: IResponseData<Organization> = {
      data: booking,
      success: true
    }

    return res.status(HttpStatus.OK).json(response)
  }

  @UseGuards(RolesGuard)
  @Roles(ORGANIZATION_ROLE.OWNER)
  @Delete(':organizationId')
  async remove(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Param('id') organizationId: string
  ) {
    await this.organizationService.remove(organizationId)
    const response: IResponseData<string> = {
      message: 'Delete successfully',
      success: true
    }
    return res.status(HttpStatus.OK).json(response)
  }
}
