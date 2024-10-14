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
  TeamCreateDto,
  TeamUpdateDto,
  TeamViewDto
} from 'difport/utils'
import { Response } from 'express'
import { Roles } from '../../auth/decorators/role.decorator'
import { OrganizationAccess } from '../../auth/guards/organization.guard'
import { IRequestWithUser } from '../../auth/request.interface'
import { TeamService } from '../services/team.service'

@UseGuards(OrganizationAccess)
@Roles(
  ORGANIZATION_ROLE.OWNER,
  ORGANIZATION_ROLE.ADMIN,
  ORGANIZATION_ROLE.MANAGER,
  ORGANIZATION_ROLE.STAFF
)
@Controller('organizations/:organizationId/teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  async create(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Param('organizationId') organizationId: string,
    @Body() body: TeamCreateDto
  ) {
    try {
      const check = await this.teamService.findByUser(organizationId, body.userId)
      if (check) {
        throw new NotFoundException('user is exists')
      }

      const query = await this.teamService.create(organizationId, body)
      const response: IResponseData<TeamViewDto> = {
        data: query as TeamViewDto,
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

    const query = await this.teamService.findAll(organizationId, currentPage, perPage)
    const total = await this.teamService.count(organizationId)
    const response: IResponsePaginate<TeamViewDto[]> = {
      success: true,
      total: total,
      currentPage: currentPage,
      perPage: perPage,
      data: query as TeamViewDto[]
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
    const query = await this.teamService.findById(organizationId, id)
    if (!query) {
      throw new NotFoundException('id not found')
    }
    const response: IResponseData<TeamViewDto> = {
      data: query as TeamViewDto,
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
    @Body() body: TeamUpdateDto
  ) {
    const query = await this.teamService.findById(organizationId, id)
    if (!query) {
      throw new NotFoundException('id not found')
    }
    await this.teamService.update(organizationId, id, body)
    const booking = await this.teamService.findById(organizationId, id)
    const response: IResponseData<TeamViewDto> = {
      data: booking as TeamViewDto,
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
    await this.teamService.remove(organizationId, id)
    const response: IResponseData<string> = {
      message: 'Delete successfully',
      success: true
    }
    return res.status(HttpStatus.OK).json(response)
  }
}
