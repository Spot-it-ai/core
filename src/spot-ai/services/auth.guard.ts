import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { JwtTokenService } from './jwt-token/jwt-token.service';

@Injectable()
export class AuthGuard implements CanActivate {

  private config: ConfigService;
  private jwtToken: JwtTokenService;

  constructor(configService: ConfigService, jwtToken: JwtTokenService) {
    this.config = configService;
    this.jwtToken = jwtToken;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.validateToken(context);
  }

  private validateToken(context: ExecutionContext): boolean {
    try {
      let request = context.switchToHttp().getRequest();
      let authHeader = request.headers.authorization;
      if (authHeader) {
        let secret = this.config.get<string>("TOKEN_SECRET");
        let token = authHeader.split(" ")[1];
        if (token) {
          let decodedObj = this.jwtToken.verify(
            token,
            secret
          );

          if (decodedObj) {
            return true;
          }
        }

        return false;
      }
    }
    catch (e) {
      console.log(e);
    }
  }
}
