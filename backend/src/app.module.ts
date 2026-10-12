import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { InvitationsModule } from './invitations/invitations.module';
import { GuestsModule } from './guests/guests.module';
import { AuthModule } from './auth/auth.module'; // <-- Bu satır DİKKAT
import { AdminModule } from './admin/admin.module';
import { StoreController } from './store/store.controller';

import { UsersModule } from './users/users.module'; 

@Module({
  imports: [
    PrismaModule, 
    InvitationsModule, 
    GuestsModule, 
    AuthModule, 
    AdminModule,
    UsersModule,
  ],
  controllers: [StoreController],
  providers: [],
})
export class AppModule {}