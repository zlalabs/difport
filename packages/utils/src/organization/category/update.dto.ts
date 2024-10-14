import { PartialType } from '@nestjs/mapped-types'
import { OrganizationReportCategoryCreateDto } from './create.dto'

export class OrganizationReportCategoryUpdateDto extends PartialType(
  OrganizationReportCategoryCreateDto
) {}
