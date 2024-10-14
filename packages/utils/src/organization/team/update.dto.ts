import { PartialType } from '@nestjs/mapped-types'
import { TeamCreateDto } from './create.dto'

export class TeamUpdateDto extends PartialType(TeamCreateDto) {}
