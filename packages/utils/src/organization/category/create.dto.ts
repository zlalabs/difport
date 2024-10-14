import { IsString } from 'class-validator'

export class OrganizationReportCategoryCreateDto {
  @IsString()
  workflowId: string

  @IsString()
  name: string
}
