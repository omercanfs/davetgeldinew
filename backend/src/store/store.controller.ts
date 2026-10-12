import { Controller, Get, Param } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Controller('store')
export class StoreController {
  @Get('categories')
  async getCategories() {
    return prisma.category.findMany({ 
      where: { isActive: true }, 
      orderBy: { id: 'asc' } 
    });
  }

  @Get('packages')
  async getPackages() {
    return prisma.package.findMany({ 
      where: { isActive: true }, 
      orderBy: { price: 'asc' } 
    });
  }

  @Get('themes/:categoryId')
  async getThemesByCategory(@Param('categoryId') categoryId: string) {
    return prisma.theme.findMany({
      where: {
        isActive: true,
        categories: {
          some: { id: Number(categoryId) }
        }
      }
    });
  }
}