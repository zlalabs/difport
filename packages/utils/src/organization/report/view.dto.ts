import { UserViewDto } from '../../user'
import { REPORT_STATUS } from '../../utils'
import { OrganizationReportCategoryViewDto } from '../category'
import { OrganizationViewDto } from '../view.dto'

export class ReportViewDto {
  id: string

  organizationId: string

  organization: OrganizationViewDto

  userId: string

  user: UserViewDto

  organizationReportCategoryId: string

  reportCategory: OrganizationReportCategoryViewDto

  title: string

  description: string

  mapLat?: number

  mapLng?: number

  reportLevel?: number

  step: number

  status: REPORT_STATUS

  published: boolean

  createdAt: Date

  updatedAt: Date
}
