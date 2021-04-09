import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Equal, Like, Repository } from 'typeorm';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from '../entity/task.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private tasksService: TasksService,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {
  }

  async getStatisticsByMonth(month: number, year: number, user: User): Promise<Object> {
    const monthDate = String(month).padStart(2, '0');
    const tasks = await this.taskRepository.find({
      user: user,
      createDate: Like(`%.${monthDate}.${year}`),
    });
    const stats = {};
    for (let i = 1; i <= 31; i++) {
      const day = String(i).padStart(2, '0');
      const dayTasks = tasks.filter(task => task.createDate.startsWith(day));
      stats[i] = dayTasks.length ? dayTasks.filter(task => task.status === TaskStatus.COMPLETE).length / dayTasks.length : 0;
    }

    return stats;
  }

  async createOrUpdate(user: User): Promise<User> {
    const existingUser: User = await this.findOne(user.name);
    if (existingUser) {
      return this.usersRepository.save({ ...existingUser, timezoneOffset: user.timezoneOffset });
    } else {
      const newUser = await this.usersRepository.save(user);
      await this.tasksService.generateTasksForUser(newUser);
      return Promise.resolve(newUser);
    }
  }

  async findOne(name: string): Promise<User> {
    return this.usersRepository.findOne({ where: { name } });
  }
}
