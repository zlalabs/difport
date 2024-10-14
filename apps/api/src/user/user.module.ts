import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthModule } from '../auth/auth.module'
import { PrismaModule } from '../prisma/prisma.module'
import { UserMeController } from './controllers/me.controller'
import { UserPublicController } from './controllers/public.controller'
import { UserService } from './services/user.service'

@Module({
  imports: [PrismaModule, JwtModule, AuthModule],
  controllers: [UserPublicController, UserMeController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
