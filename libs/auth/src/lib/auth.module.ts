import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from 'apps/api/src/app/users.module'; // Import UsersModule

@Module({
  imports: [
    UsersModule, // Allows AuthService to use UsersService
    PassportModule,
    JwtModule.register({
      secret: 'YOUR_SECRET_KEY', // Must match the key in JwtStrategy
      signOptions: { expiresIn: '1h' }, // Token expires in 1 hour
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService], // Export AuthService so the API can use it
})
export class AuthModule {}