import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './services/users.service';
import { TasksController } from './controllers/tasks.controller';
import { User } from './entity/user.entity';
import { Task } from './entity/task.entity';
import { TasksService } from './services/tasks.service';
import { UsersController } from './controllers/users.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db',
      entities: [User, Task],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Task]),
    ScheduleModule.forRoot(),
  ],
  controllers: [UsersController, TasksController],
  providers: [TasksService, UsersService],
})
export class AppModule {
}
