import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { PrismaModule } from '../prisma/prisma.module'
import { AuthController } from './controllers/auth.controller'
import { JwtAuthGuard } from './guards/auth.guard'
import { AuthService } from './services/auth.service'

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET')

        return {
          secret: secret,
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRATION_TIME')
          }
        }
      }
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    }
  ],
  exports: [AuthService]
})
export class AuthModule {}
