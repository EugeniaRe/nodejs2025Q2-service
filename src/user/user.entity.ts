// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   ValueTransformer,
//   BeforeInsert,
// } from 'typeorm';
// import * as bcrypt from 'bcrypt';

// const bigintTransformer: ValueTransformer = {
//   to: (value: number) => value,
//   from: (value: string) => Number(value),
// };

// @Entity()
// export class User {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column()
//   login: string;

//   @Column()
//   password: string;

//   @BeforeInsert()
//   async hashPassword() {
//     this.password = await bcrypt.hash(this.password, 10);
//   }

//   async comparePassword(attempt: string): Promise<boolean> {
//     return await bcrypt.compare(attempt, this.password);
//   }

//   @Column()
//   version: number;

//   @Column({ type: 'bigint', transformer: bigintTransformer })
//   createdAt: number;

//   @Column({ type: 'bigint', transformer: bigintTransformer })
//   updatedAt: number;
// }

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ValueTransformer,
} from 'typeorm';

const bigintTransformer: ValueTransformer = {
  to: (value: number) => value,
  from: (value: string) => Number(value),
};

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  login: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column()
  version: number;

  @Column({ type: 'bigint', transformer: bigintTransformer })
  createdAt: number;

  @Column({ type: 'bigint', transformer: bigintTransformer })
  updatedAt: number;
}
