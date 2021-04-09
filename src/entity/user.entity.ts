import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  name: string;

  @Column()
  timezoneOffset: number;

  @Column({ default: 4 })
  numberOfTasks: number;
}
