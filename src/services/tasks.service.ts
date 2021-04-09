import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from '../entity/task.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {

  private taskTemplates: string[] = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Fusce nisi purus, accumsan non augue ut, pretium tristique augue.',
    'Cras pellentesque arcu ac tellus maximus tincidunt.',
    'Mauris a lectus euismod, auctor dui id, mattis nisl.',
    'Donec magna massa, fermentum id laoreet et, aliquam ut ex.',
    'Mauris consectetur, lacus ut ornare consectetur, nunc lacus finibus elit, id consectetur purus mi sed orci.',
    'Donec facilisis ut est ut maximus.',
    'Morbi sodales neque a felis feugiat, quis porttitor urna tincidunt.',
    'Aliquam et ante nec metus faucibus aliquam eget eget purus. Praesent sodales luctus ipsum at maximus.',
    'Donec pulvinar lacinia risus, sed auctor dolor.',
    'Aliquam metus diam, mattis et interdum sit amet, semper eget magna.',
    'Donec fringilla efficitur enim id dignissim.',
    'Cras arcu nulla, commodo id dapibus at, laoreet sit amet ligula. Nunc ut justo sed neque finibus consectetur.',
    'In hendrerit ipsum eu nulla congue, sed semper magna imperdiet.',
  ];

  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {

  }

  async findTodayTasksByUser(user: User): Promise<Task[]> {
    const today: string = new Date().toLocaleDateString();
    return this.tasksRepository.find({ where: { user, createDate: today } });
  }

  async findOneById(id: string): Promise<Task> {
    return this.tasksRepository.findOne({ where: { id } });
  }

  async updateTask(task: Task): Promise<Task> {
    return this.tasksRepository.save(task);
  }

  public async generateTasksForUser(user: User): Promise<Task[]> {
    const today: string = new Date().toLocaleDateString();
    const randomTasks: Partial<Task>[] = this.taskTemplates
      .sort(() => .5 - Math.random())
      .slice(0, user.numberOfTasks)
      .map((description, i) => ({
        user: user,
        description: description,
        number: i + 1,
        status: TaskStatus.OPEN,
        createDate: today,
      }));
    return this.tasksRepository.save(randomTasks);
  }

  @Cron('0 0 * * * *')
  private generateTasks() {

    const today: string = new Date().toLocaleDateString();

    this.usersRepository.find().then(users => {
      const allNewTasks = [];
      users.forEach(user => {
        const randomTasks: Partial<Task>[] = this.taskTemplates
          .sort(() => .5 - Math.random())
          .slice(0, user.numberOfTasks)
          .map((description, i) => ({
            user: user,
            description: description,
            number: i + 1,
            status: TaskStatus.OPEN,
            createDate: today,
          }));
        allNewTasks.push(...randomTasks);
      });
      return this.tasksRepository.save(allNewTasks);
    }).then(tasks => {
      console.log('tasks generated');
    });
  }
}
