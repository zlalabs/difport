import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Put,
  Req,
  Res
} from '@nestjs/common'
import { IResponseData, UserUpdateDto, UserViewDto } from 'difport/utils'
import { Response } from 'express'
import { IRequestWithUser } from '../../auth/request.interface'
import { UserService } from '../services/user.service'

@Controller('users/me')
export class UserMeController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findById(@Req() req: IRequestWithUser, @Res() res: Response) {
    const userId = req!.user!.id
    const query = await this.userService.findById(userId)
    if (!query) {
      throw new NotFoundException('id not found')
    }
    const response: IResponseData<UserViewDto> = {
      data: query,
      success: true
    }

    return res.status(HttpStatus.OK).json(response)
  }

  @Put()
  async update(
    @Req() req: IRequestWithUser,
    @Res() res: Response,
    @Param('id') id: string,
    @Body() body: UserUpdateDto
  ) {
    const userId = req!.user!.id
    const query = await this.userService.findById(userId)
    if (!query) {
      throw new NotFoundException('id not found')
    }
    await this.userService.update(id, body)
    const data = await this.userService.findById(id)
    const response: IResponseData<UserViewDto> = {
      data: data,
      success: true
    }

    return res.status(HttpStatus.OK).json(response)
  }

  @Delete()
  async remove(@Req() req: IRequestWithUser, @Res() res: Response) {
    const userId = req!.user!.id
    await this.userService.remove(userId)
    const response: IResponseData<string> = {
      message: 'Delete successfully',
      success: true
    }
    return res.status(HttpStatus.OK).json(response)
  }
}
