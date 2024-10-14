import { SetMetadata } from '@nestjs/common'
import { ORGANIZATION_ROLE } from 'difport/utils'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: ORGANIZATION_ROLE[]) => SetMetadata(ROLES_KEY, roles)
