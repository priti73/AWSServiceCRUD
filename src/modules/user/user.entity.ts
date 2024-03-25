
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, Unique } from 'typeorm';
import { Bucket } from '../buckets/entity/bucket.entity';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email:string;
  
  @OneToMany(() => Bucket, bucket => bucket.user)
  buckets: Bucket[];
}
