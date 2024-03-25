
import { Bucket } from 'src/modules/buckets/entity/bucket.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  contentType: string;


  @ManyToOne(() => Bucket, bucket => bucket.files)
  bucket: Bucket;
}
