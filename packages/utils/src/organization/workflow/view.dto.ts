import { OrganizationViewDto } from '../view.dto'

export class OrganizationWorkflowViewDto {
  id: string

  organizationId: string

  organization: OrganizationViewDto

  name: string
}
