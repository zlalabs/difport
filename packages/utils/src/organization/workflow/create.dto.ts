import { IsString } from 'class-validator'

export class OrganizationWorkflowCreateDto {
  @IsString()
  name: string
}
