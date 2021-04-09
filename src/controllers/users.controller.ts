import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { User } from '../entity/user.entity';
import { Task } from '../entity/task.entity';
import { TasksService } from '../services/tasks.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService, private tasksService: TasksService) {
  }

  @Post()
  async login(@Body() user: User): Promise<User> {
    return this.usersService.createOrUpdate(user);
  }

  @Get(':username/stats')
  async getStats(@Param('username') name: string,
                      @Query('month') month,
                      @Query('year') year): Promise<Object> {
    const user = await this.usersService.findOne(name);
    return this.usersService.getStatisticsByMonth(month, year, user)
  }

  @Patch()
  async updateSettings(@Body() user: User): Promise<User> {
    return this.usersService.createOrUpdate(user);
  }

  @Get(':username/tasks')
  async findUserTasks(@Param('username') username: string): Promise<Task[]> {
    const user = await this.usersService.findOne(username);
    return this.tasksService.findTodayTasksByUser(user);
  }
}
