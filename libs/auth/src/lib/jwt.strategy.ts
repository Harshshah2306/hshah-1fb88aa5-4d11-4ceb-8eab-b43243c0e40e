import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'YOUR_SECRET_KEY', // ⚠️ In a real app, use process.env.JWT_SECRET
    });
  }

  async validate(payload: any) {
    // This payload is the decoded JWT. We return what we want available in Request.user
    return { id: payload.sub, username: payload.username, role: payload.role };
  }
}