import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Favorites {
  @PrimaryColumn({ type: 'int', default: 1 })
  id: number;

  @Column({ type: 'uuid', array: true, default: '{}' })
  artists: string[];

  @Column({ type: 'uuid', array: true, default: '{}' })
  albums: string[];

  @Column({ type: 'uuid', array: true, default: '{}' })
  tracks: string[];
}
