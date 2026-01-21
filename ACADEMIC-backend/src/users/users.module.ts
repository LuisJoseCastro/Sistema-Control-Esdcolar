import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity'; // Tu entidad User

@Module({
  imports: [TypeOrmModule.forFeature([User])], // <--- ¡ESTO CREA LA TABLA USUARIOS!
  controllers: [],
  providers: [],
  exports: [TypeOrmModule] // Para que AuthModule pueda usar el repositorio de User
})
export class UsersModule {}