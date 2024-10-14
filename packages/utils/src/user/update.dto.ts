import { PartialType } from '@nestjs/mapped-types'
import { IsEmail, IsOptional, IsString } from 'class-validator'
import { UserCreateDto } from './create.dto'

export class UserUpdateDto extends PartialType(UserCreateDto) {
  @IsOptional()
  @IsString()
  firstName?: string

  @IsOptional()
  @IsString()
  lastName?: string

  @IsEmail()
  email: string

  @IsString()
  @IsOptional()
  mobile?: string
}
