import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { TeacherProfile } from '../../teacher/entities/teacher-profile.entity';
import { Group } from './group.entity';
import { Subject } from './subject.entity';

import { Schedule } from './schedule.entity';
import { GradeCard } from './grade-card.entity';

@Entity('cursos')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => TeacherProfile)
  @JoinColumn({ name: 'id_docente' })
  teacher: TeacherProfile;

  @ManyToOne(() => Group)
  @JoinColumn({ name: 'id_grupo' })
  group: Group;

  @ManyToOne(() => Subject)
  @JoinColumn({ name: 'id_materia' })
  subject: Subject;

  @Column({ name: 'salon_default', nullable: true })
  salonDefault: string;

  @OneToMany(() => Schedule, (schedule) => schedule.course)
  schedules: Schedule[];

  @OneToMany(() => GradeCard, (grade) => grade.course)
  gradeCards: GradeCard[];
}
