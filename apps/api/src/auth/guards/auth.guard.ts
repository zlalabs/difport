import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'
import { AuthService } from '../services/auth.service'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService
  ) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (isPublic) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const token = this.extractTokenFromHeader(request)

    if (!token) {
      throw new UnauthorizedException()
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET
      })

      const find = await this.authService.findByAuthUser(payload.sub, payload.username)
      if (!find) {
        throw new UnauthorizedException()
      }

      request['user'] = payload
      return true
    } catch {
      throw new UnauthorizedException()
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? []
    return type === 'Bearer' ? token : undefined
  }
}
