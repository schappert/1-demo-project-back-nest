import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from '../dtos/users.dto';
// test : 1 CI-CD
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; username?: string, email?: string, password?: string },
  ): Promise<User> {
    return this.usersService.update(Number(id), body);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(Number(id));
  }
}
