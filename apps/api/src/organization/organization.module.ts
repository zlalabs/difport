import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthModule } from '../auth/auth.module'
import { PrismaModule } from '../prisma/prisma.module'
import { ReportCategoryController } from './controllers/category.controller'
import { OrganizationController } from './controllers/organization.controller'
import { TeamController } from './controllers/team.controller'
import { ReportCategoryService } from './services/category.service'
import { OrganizationService } from './services/organization.service'
import { TeamService } from './services/team.service'

@Module({
  imports: [PrismaModule, JwtModule, AuthModule],
  controllers: [OrganizationController, ReportCategoryController, TeamController],
  providers: [OrganizationService, ReportCategoryService, TeamService],
  exports: [OrganizationService, ReportCategoryService, TeamService]
})
export class OrganizationModule {}
