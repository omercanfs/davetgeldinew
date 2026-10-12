import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { InvitationsService } from './invitations.service';

@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  // RESİM YÜKLEME ENDPOINT'İ
  @Post(':id/gallery')
  @UseInterceptors(FilesInterceptor('files', 10, { 
    storage: diskStorage({
      destination: './uploads', 
      filename: (req: any, file: any, cb: any) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      }
    })
  }))
  async uploadGallery(@Param('id') id: string, @UploadedFiles() files: any[]) {
    return this.invitationsService.addGalleryImages(+id, files);
  }

  // RESİM SİLME ENDPOINT'İ
  @Delete('gallery/:imageId')
  async deleteGalleryImage(@Param('imageId') imageId: string) {
    return this.invitationsService.deleteGalleryImage(+imageId);
  }
  
  @Post()
  create(@Body() rawData: any) {
    return this.invitationsService.create(rawData);
  }

  @Get()
  findAll() {
    return this.invitationsService.findAll();
  }

  @Get('by-slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.invitationsService.findBySlug(slug);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.invitationsService.findByUser(+userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invitationsService.findOne(+id);
  }

  @Get('slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.invitationsService.findBySlug(slug);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() rawData: any) {
    return this.invitationsService.update(+id, rawData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invitationsService.remove(+id);
  }
}