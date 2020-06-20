import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { JwtTokenService } from './jwt-token/jwt-token.service';
export declare class AuthGuard implements CanActivate {
    private config;
    private jwtToken;
    constructor(configService: ConfigService, jwtToken: JwtTokenService);
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean>;
    private validateToken;
}
