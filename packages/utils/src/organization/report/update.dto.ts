import { PartialType } from '@nestjs/mapped-types'
import { ReportCreateDto } from './create.dto'

export class ReportUpdateDto extends PartialType(ReportCreateDto) {}
