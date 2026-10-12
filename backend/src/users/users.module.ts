import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
// PrismaService'i kullanabilmek için PrismaModule'ü de çağırıyoruz (Yolunu kendi projene göre düzelt)
import { PrismaModule } from '../prisma/prisma.module'; 

@Module({
  imports: [PrismaModule], // Veritabanı işlemleri için Prisma'yı dahil ettik
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}