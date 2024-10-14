import { PartialType } from '@nestjs/mapped-types'
import { OrganizationWorkflowCreateDto } from './create.dto'

export class OrganizationWorkflowUpdateDto extends PartialType(OrganizationWorkflowCreateDto) {}
