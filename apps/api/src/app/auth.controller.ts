import { Controller, Post, Body, UnauthorizedException, Logger } from '@nestjs/common';
import { AuthService } from 'libs/auth/src/lib/auth.service';
import { CreateUserDto } from '@hshah-1fb88aa5-4d11-4ceb-8eab-b43243c0e40e/data';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');

  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: any) {
    // 1. Log what we received (This helps us debug!)
    this.logger.log(`Attempting login...`);
    this.logger.log(`Body received: ${JSON.stringify(body)}`);

    // 2. Safety Check: Is the body missing?
    if (!body) {
      this.logger.error('❌ Error: The Request Body is undefined.');
      throw new UnauthorizedException('Request body is missing');
    }

    // 3. Safety Check: Is the email missing?
    if (!body.email || !body.password) {
      this.logger.error('❌ Error: Email or Password missing in body.');
      throw new UnauthorizedException('Email and Password are required');
    }

    // 4. Validate the user
    const user = await this.authService.validateUser(body.email, body.password);
    
    if (!user) {
      this.logger.warn(`❌ Login failed for email: ${body.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    // 5. Success
    this.logger.log(`✅ Login successful for: ${body.email}`);
    return this.authService.login(user);
  }
  
  @Post('register')
  async register(@Body() body: CreateUserDto) {
      return this.authService.register(body);
  }
}