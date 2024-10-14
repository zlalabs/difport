import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class OrganizationAccess implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request?.user
    const organizationId = request?.params?.organizationId

    if (!user.id && organizationId) {
      return
    }

    const access = await this.prisma.organizationTeam.findFirst({
      where: { organizationId: organizationId, userId: user!.id }
    })

    if (!access) {
      return false
    }

    return true
  }
}
