import { PartialType } from '@nestjs/mapped-types'
import { OrganizationCreateDto } from './create.dto'

export class OrganizationUpdateDto extends PartialType(OrganizationCreateDto) {}
