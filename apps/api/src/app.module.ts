import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { join } from 'path'
import { AuthModule } from './auth/auth.module'

import { FileModule } from './file/file.module'
import { InitModule } from './init/init.module'
import { NotificationModule } from './notification/notification.module'
import { OrganizationModule } from './organization/organization.module'
import { ReportModule } from './report/report.module'
import { UserModule } from './user/user.module'
import { WorkflowModule } from './workflow/workflow.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: join(__dirname, '../../../.env'),
      isGlobal: true
    }),
    InitModule,
    UserModule,
    AuthModule,
    OrganizationModule,
    ReportModule,
    FileModule,
    NotificationModule,
    WorkflowModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
