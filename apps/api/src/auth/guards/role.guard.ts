import { ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Reflector } from '@nestjs/core'
import { PassportStrategy } from '@nestjs/passport'
import { ORGANIZATION_ROLE } from 'difport/utils'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from '../../prisma/prisma.service'
import { ROLES_KEY } from '../decorators/role.decorator'

@Injectable()
export class RolesGuard extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private reflector: Reflector,
    private prisma: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET')
    })
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const requiredRoles = this.reflector.getAllAndOverride<ORGANIZATION_ROLE[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ])

    const user = request!.user
    const organizationId = request!.params!.organizationId

    if (!user?.id || !organizationId) {
      return
    }

    const team = await this.prisma.organizationTeam.findFirst({
      where: { organizationId: organizationId, userId: user!.id }
    })

    const access = requiredRoles?.some((role) => team?.role?.includes(role))
    return access
  }
}
