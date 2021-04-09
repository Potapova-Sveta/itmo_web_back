import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { Task } from '../entity/task.entity';
import { TasksService } from '../services/tasks.service';
import { UsersService } from '../services/users.service';

@Controller('tasks')
export class TasksController {

  constructor(private tasksService: TasksService, private usersService: UsersService) {
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string) {
    return this.tasksService.findOneById(id);
  }

  @Patch(':id')
  async updateTask(@Param('id') id: string, @Body() task: Task): Promise<Task> {
    return this.tasksService.updateTask(task);
  }
}
