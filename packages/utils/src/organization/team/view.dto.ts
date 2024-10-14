import { UserViewDto } from '../../user'
import { ORGANIZATION_ROLE } from '../../utils'
import { OrganizationViewDto } from '../view.dto'

export class TeamViewDto {
  id: string

  organizationId: string

  organization: OrganizationViewDto

  userId: string

  user: UserViewDto

  role: ORGANIZATION_ROLE
}
