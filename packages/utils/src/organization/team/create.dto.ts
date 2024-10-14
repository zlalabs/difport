import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator'
import { ORGANIZATION_ROLE } from '../../utils'

export class TeamCreateDto {
  @IsUUID()
  userId: string

  @IsNotEmpty()
  @IsEnum(ORGANIZATION_ROLE, {
    message: 'Role must be a valid enum value (owner, admin, manager, staff)'
  })
  role: ORGANIZATION_ROLE
}
