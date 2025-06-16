import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';
import { UserService } from '../user/user.service';
import { SignupUserDto } from './dto/signup.dto';
import { UserResponseDto } from 'src/user/dto/userResponse.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async signup(signupDto: SignupUserDto) {
    const user = await this.userService.getUserByLogin(signupDto.login);
    if (user) {
      const passwordMatches = await bcrypt.compare(
        signupDto.password,
        user.password,
      );
      if (!passwordMatches) {
        return new ForbiddenException('Access Denied');
      }
      return user;
    }
    return this.userService.createUser(signupDto);
  }

  async login(loginDto: { login: string; password: string }) {
    const user = await this.userService.getUserByLogin(loginDto.login);
    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    const passwordMatches = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!passwordMatches) {
      throw new ForbiddenException('Access Denied');
    }

    return this.generateTokens(user);
  }

  async generateTokens(user: UserResponseDto) {
    const payload = { userId: user.id, login: user.login };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_REFRESH_KEY,
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
    });
    return { accessToken, refreshToken };
  }
}
