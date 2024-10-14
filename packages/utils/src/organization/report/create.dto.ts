import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class ReportCreateDto {
  @IsString()
  organizationId: string

  @IsString()
  categoryId: string

  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description: string

  @IsOptional()
  @IsNumber()
  mapLat?: number

  @IsOptional()
  @IsNumber()
  mapLng?: number

  @IsNumber()
  step: number

  @IsBoolean()
  published: boolean
}
