import { Body, Controller, HttpException, HttpStatus, Post, Req, Res } from '@nestjs/common'
import { IResponseData, UserCreateDto, UserViewDto } from 'difport/utils'
import { Response } from 'express'
import { Public } from 'src/auth/decorators/public.decorator'
import { UserService } from '../services/user.service'

@Controller('users')
export class UserPublicController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async create(@Req() req: Request, @Res() res: Response, @Body() body: UserCreateDto) {
    try {
      const query = await this.userService.create(body)
      const response: IResponseData<UserViewDto> = {
        data: query as UserViewDto,
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
}
