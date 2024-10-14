import { OrganizationViewDto } from '../view.dto'
import { OrganizationWorkflowViewDto } from '../workflow'

export class OrganizationReportCategoryViewDto {
  id: string

  organizationId: string

  organization: OrganizationViewDto

  organizationWorkflowId: string

  workflow: OrganizationWorkflowViewDto

  name: string
}
