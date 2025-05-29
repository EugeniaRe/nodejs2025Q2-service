import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../user/user.interface';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UpdatePasswordDto } from '../user/dto/update-password.dto';

@Injectable()
export class DatabaseService {
  private users: User[] = [];

  // private getAll<T>(data: T[]): T[] {
  //   return data;
  // }

  private findById<T extends { id: string }>(
    data: T[],
    id: string,
  ): T | undefined {
    return data.find((item) => item.id === id);
  }

  private createItem<T extends { id: string }, createDto>(
    data: T[],
    dto: createDto,
    newItemPartial: Omit<T, 'id'>,
  ): T {
    const newItem: T = {
      id: uuidv4(),
      ...newItemPartial,
    } as T;
    data.push(newItem);
    return newItem;
  }

  private updateItem<T extends { id: string }, Uto>(
    data: T[],
    id: string,
    dto: Uto,
    updateLogic: (item: T, updateDto: Uto) => void,
  ): T | undefined {
    const index = data.findIndex((item) => item.id === id);
    if (index === -1) {
      return undefined;
    }
    const item = data[index];
    updateLogic(item, dto);

    return item;
  }

  private filterArrayAndCheckDeletion<T extends { id: string }>(
    dataArray: T[],
    idToRemove: string,
  ): { newArray: T[]; wasDeleted: boolean } {
    const initialLength = dataArray.length;
    const newArray = dataArray.filter((item) => item.id !== idToRemove);
    const wasDeleted = newArray.length < initialLength;
    return { newArray, wasDeleted };
  }

  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.findById(this.users, id);
  }

  createUser(createUserData: CreateUserDto): User {
    const createdTime = Date.now();
    const newUser = this.createItem(this.users, createUserData, {
      login: createUserData.login,
      password: createUserData.password,
      version: 1,
      createdAt: createdTime,
      updatedAt: createdTime,
    });
    return newUser;
  }

  updateUser(
    id: string,
    updatePasswordData: UpdatePasswordDto,
  ): User | undefined | null {
    const user = this.getUserById(id);
    if (!user) {
      return undefined;
    }

    if (user.password !== updatePasswordData.oldPassword) {
      return null;
    }

    user.password = updatePasswordData.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    return user;
  }

  deleteUser(id: string): boolean {
    const { newArray, wasDeleted } = this.filterArrayAndCheckDeletion(
      this.users,
      id,
    );
    if (wasDeleted) {
      this.users = newArray;
    }
    return wasDeleted;
  }
}
