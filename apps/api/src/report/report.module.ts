import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthModule } from '../auth/auth.module'
import { PrismaModule } from '../prisma/prisma.module'
import { MeController } from './controllers/me.controller'
import { ReportController } from './controllers/report.controller'
import { ReportService } from './services/report.service'

@Module({
  imports: [PrismaModule, JwtModule, AuthModule],
  controllers: [MeController, ReportController],
  providers: [ReportService],
  exports: [ReportService]
})
export class ReportModule {}
