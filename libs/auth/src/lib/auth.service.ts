import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

// Check these import paths match your project structure
import { UsersService } from 'apps/api/src/app/users.service';
import { CreateUserDto } from '@hshah-1fb88aa5-4d11-4ceb-8eab-b43243c0e40e/data';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  // 1. Validate User (Used by LocalStrategy)
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);

    // Check if user exists AND if password matches the hash
    if (user && (await bcrypt.compare(pass, user.password))) {
      // Strip the password before returning the user object
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // 2. Login (Generates JWT Token)
  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
      user: user,
    };
  }

  // 3. Register (Creates New User)
  async register(userDto: CreateUserDto) {
    // A. Generate a safe "salt"
    const salt = await bcrypt.genSalt();

    // B. Hash the password using that salt
    const hashedPassword = await bcrypt.hash(userDto.password, salt);

    // C. Create the user in the database
    const rawResult = await this.usersService.create({
      ...userDto,
      password: hashedPassword,
    });

    // --- FIX FOR YOUR ERROR STARTS HERE ---
    // If the database returns an array (User[]), we grab the first item.
    // If it returns a single object, we use it directly.
    const newUser = Array.isArray(rawResult) ? rawResult[0] : rawResult;
    // --- FIX ENDS HERE ---

    // D. Return the user info without the password
    const { password, ...result } = newUser;
    return result;
  }
}