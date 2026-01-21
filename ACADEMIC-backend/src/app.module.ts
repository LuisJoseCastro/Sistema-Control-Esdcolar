import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { TenantsModule } from './tenants/tenants.module';
import { AdminModule } from './admin/admin.module';
import { TeacherModule } from './teacher/teacher.module';
import { StudentModule } from './student/student.module';
import { SharedModule } from './shared/shared.module';
import { UsersModule } from './users/users.module'; 
import { FinanceModule } from './finance/finance.module'; 
import { AcademicModule } from './academic/academic.module'; 
import { CommunicationsModule } from './communications/communications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USER || 'admin',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'academic_saas',
      autoLoadEntities: true, 
      synchronize: true, 
      dropSchema: false,
    }),

    CoreModule,
    AuthModule,
    TenantsModule,
    UsersModule,
    AdminModule,
    TeacherModule,
    StudentModule,
    SharedModule,
    AcademicModule,
    FinanceModule,
    CommunicationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
