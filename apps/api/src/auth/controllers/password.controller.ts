import { Controller } from '@nestjs/common'

@Controller('auth/password')
export class PasswordController {
  async forgetPassword() {}

  async resetPassword() {}
}
