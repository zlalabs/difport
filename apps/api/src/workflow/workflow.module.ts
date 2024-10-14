import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthModule } from '../auth/auth.module'
import { PrismaModule } from '../prisma/prisma.module'
import { WorkflowController } from './controllers/workflow.controller'
import { WorkflowService } from './services/workflow.service'

@Module({
  imports: [PrismaModule, JwtModule, AuthModule],
  controllers: [WorkflowController],
  providers: [WorkflowService],
  exports: [WorkflowService]
})
export class WorkflowModule {}
