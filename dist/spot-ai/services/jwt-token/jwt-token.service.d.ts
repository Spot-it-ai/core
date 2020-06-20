export declare class JwtTokenService {
    sign(payload: any, secret: string): string;
    verify(token: string, secret: string): any;
}
