import { Controller, Get, Patch, Param, ParseIntPipe, Body, Post } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  getDashboardStats() { return this.adminService.getDashboardStats(); }

  @Get('invitations')
  getRecentInvitations() { return this.adminService.getRecentInvitations(); }

  @Patch('invitations/:id/approve')
  approveInvitation(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.approveInvitation(id);
  }

  @Patch('invitations/:id/expire')
  expireInvitation(@Param('id', ParseIntPipe) id: number) {
    return this.adminService.expireInvitation(id);
  }

  // YENİ ALANLAR
  @Get('packages')
  getPackages() {
    return this.adminService.getPackages();
  }

  @Post('packages')
  createPackage(@Body() data: any) {
    return this.adminService.createPackage(data);
  }

  @Patch('packages/:id')
  updatePackage(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.adminService.updatePackage(id, data);
  }

  // ==========================================
  // KATEGORİ YÖNETİMİ
  // ==========================================

  @Get('categories')
  getCategories() {
    return this.adminService.getCategories();
  }

  @Post('categories')
  createCategory(@Body() data: any) {
    return this.adminService.createCategory(data);
  }

  @Patch('categories/:id')
  updateCategory(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.adminService.updateCategory(id, data);
  }

  // ==========================================
  // TEMA YÖNETİMİ
  // ==========================================

  @Get('themes')
  getThemes() {
    return this.adminService.getThemes();
  }

  @Post('themes')
  createTheme(@Body() data: any) {
    return this.adminService.createTheme(data);
  }

  @Patch('themes/:id')
  updateTheme(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.adminService.updateTheme(id, data);
  }

}