import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { CreateGuestDto } from './dto/create-guest.dto';

@Controller('guests')
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @Post()
  create(@Body() createGuestDto: CreateGuestDto) {
    return this.guestsService.create(createGuestDto);
  }

  @Patch(':id/attendance')
  updateAttendance(@Param('id') id: string, @Body('attendance') attendance: 'PENDING' | 'ATTENDING' | 'DECLINED') {
    return this.guestsService.updateAttendance(Number(id), attendance);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.guestsService.remove(Number(id));
  }
}