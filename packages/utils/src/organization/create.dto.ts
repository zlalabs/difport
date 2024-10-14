import { IsString } from 'class-validator'

export class OrganizationCreateDto {
  @IsString()
  name: string
}
