import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/helpers/hash.service';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private hashService: HashService,
  ) {}

  async signIn(
    username: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findByUsername(username);

    if (!user || !(await this.hashService.compare(password, user?.password))) {
      throw new UnauthorizedException();
    }
    const payload = { username: user.username, sub: user._id, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload)
    };
  }
}
