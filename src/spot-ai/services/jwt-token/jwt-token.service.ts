import { Injectable } from '@nestjs/common';
import * as jwt from "jsonwebtoken";

@Injectable()
export class JwtTokenService {
  sign(payload: any, secret: string): string {
    return jwt.sign(payload, secret, {
      algorithm: "HS512",
      expiresIn: "10h",
    });
  }

  verify(token: string, secret: string): any {
    try {
      return jwt.verify(token, secret);
    }
    catch (e) {
      return null;
    }
  }
}
