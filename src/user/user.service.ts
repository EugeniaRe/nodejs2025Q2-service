import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
// import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {}

  getAllUsers(): UserResponseDto[] {
    const users = this.databaseService.getUsers();
    return users.map((user) => delete user.password && user);
  }

  getUserById(id: string): UserResponseDto {
    const user = this.databaseService.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    delete user.password;

    return user;
  }

  createUser(createUserDto: CreateUserDto): UserResponseDto {
    const newUser = this.databaseService.createUser(createUserDto);
    const responseUser = instanceToPlain(newUser, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
    }) as UserResponseDto;
    delete responseUser.password;
    return responseUser;
  }
  updateUser(
    id: string,
    updatePasswordData: UpdatePasswordDto,
  ): UserResponseDto {
    const updatedUser = this.databaseService.updateUser(id, updatePasswordData);

    if (updatedUser === undefined) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (updatedUser === null) {
      throw new ForbiddenException(`Old password is wrong`);
    }
    delete updatedUser.password;
    return updatedUser as UserResponseDto;
  }

  deleteUser(id: string): void {
    const deleted = this.databaseService.deleteUser(id);
    if (!deleted) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
  }
}
