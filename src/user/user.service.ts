import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { UserResponseDto } from './dto/userResponse.dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {}

  async getAllUsers() {
    const users = await this.databaseService.getUsers();

    return users.map((user) => delete user.password && user);
  }

  async getUserById(id: string) {
    const user = await this.databaseService.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    delete user.password;

    return user;
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = await this.databaseService.createUser(createUserDto);
    const responseUser = instanceToPlain(newUser, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    }) as UserResponseDto;
    delete responseUser.password;

    return responseUser;
  }
  async updateUser(id: string, updatePasswordData: UpdatePasswordDto) {
    const updatedUser = await this.databaseService.updateUser(
      id,
      updatePasswordData,
    );

    if (updatedUser === undefined) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (updatedUser === null) {
      throw new ForbiddenException(`Old password is wrong`);
    }
    delete updatedUser.password;

    return updatedUser;
  }

  async deleteUser(id: string) {
    const userExists = await this.databaseService.getUserById(id);
    if (!userExists) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const wasDeleted = await this.databaseService.deleteUser(id);
    if (!wasDeleted) {
      throw new Error(`Failed to delete user with id ${id}`);
    }
  }
}
