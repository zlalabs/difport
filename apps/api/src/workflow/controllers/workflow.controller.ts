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
  OrganizationWorkflowCreateDto,
  OrganizationWorkflowUpdateDto,
  OrganizationWorkflowViewDto
} from 'difport/utils'
import { Response } from 'express'
import { Roles } from '../../auth/decorators/role.decorator'
import { OrganizationAccess } from '../../auth/guards/organization.guard'
import { IRequestWithUser } from '../../auth/request.interface'
import { WorkflowService } from '../services/workflow.service'

@UseGuards(OrganizationAccess)
@Roles(
  ORGANIZATION_ROLE.OWNER,
  ORGANIZATION_ROLE.ADMIN,
  ORGANIZATION_ROLE.MANAGER,
  ORGANIZATION_ROLE.STAFF
)
@Controller('/organizations/:organizationId/workflows')
export class WorkflowController {
  constructor(private readonly organizationWorkflow: WorkflowService) {}

  @Post()
  async create(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Param('organizationId') organizationId: string,
    @Body() body: OrganizationWorkflowCreateDto
  ) {
    try {
      const query = await this.organizationWorkflow.create(organizationId, body)
      const response: IResponseData<OrganizationWorkflowViewDto> = {
        data: query as OrganizationWorkflowViewDto,
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

    const query = await this.organizationWorkflow.findAll(organizationId, currentPage, perPage)
    const total = await this.organizationWorkflow.count(organizationId)
    const response: IResponsePaginate<OrganizationWorkflowViewDto[]> = {
      success: true,
      total: total,
      currentPage: currentPage,
      perPage: perPage,
      data: query as OrganizationWorkflowViewDto[]
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
    const query = await this.organizationWorkflow.findById(organizationId, id)
    if (!query) {
      throw new NotFoundException('id not found')
    }
    const response: IResponseData<OrganizationWorkflowViewDto> = {
      data: query as OrganizationWorkflowViewDto,
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
    @Body() body: OrganizationWorkflowUpdateDto
  ) {
    const query = await this.organizationWorkflow.findById(organizationId, id)
    if (!query) {
      throw new NotFoundException('id not found')
    }
    await this.organizationWorkflow.update(organizationId, id, body)
    const booking = await this.organizationWorkflow.findById(organizationId, id)
    const response: IResponseData<OrganizationWorkflowViewDto> = {
      data: booking as OrganizationWorkflowViewDto,
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
    await this.organizationWorkflow.remove(organizationId, id)
    const response: IResponseData<string> = {
      message: 'Delete successfully',
      success: true
    }
    return res.status(HttpStatus.OK).json(response)
  }
}
