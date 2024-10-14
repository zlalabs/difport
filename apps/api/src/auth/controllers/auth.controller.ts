import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common'
import { ERROR_MSG_TYPE, IErrorDto, UserSignIn } from 'difport/utils'
import { Response } from 'express'
import { Public } from '../decorators/public.decorator'
import { AuthService } from '../services/auth.service'

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('users')
  async userLogin(@Res() res: Response, @Body() body: UserSignIn) {
    const validate = await this.authService.validateUser(body)
    if (!validate) {
      const errors: IErrorDto = {
        message: [
          {
            property: ERROR_MSG_TYPE.SYSTEM,
            message: 'Username or password not match.'
          }
        ],
        success: false
      }

      return res.status(HttpStatus.UNAUTHORIZED).json(errors)
    }

    return res.status(HttpStatus.OK).json({
      data: validate,
      success: true
    })
  }
}
