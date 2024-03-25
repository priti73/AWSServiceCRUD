// src/buckets/entities/bucket.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { File } from '../../files/entities/file.entity';
import { User } from 'src/modules/user/user.entity';

@Entity()
export class Bucket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => File, file => file.bucket)
  files: File[];

  @ManyToOne(() => User, user => user.buckets)
  user: User;
}
