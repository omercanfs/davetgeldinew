import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const totalInvitations = await this.prisma.invitation.count();
    const pendingPayment = await this.prisma.invitation.count({ where: { status: 'PENDING_PAYMENT' } });
    const activeInvitations = await this.prisma.invitation.count({ where: { status: 'ACTIVE' } });
    
    const activeInvs = await this.prisma.invitation.findMany({
      where: { status: 'ACTIVE' },
      include: { package: true }
    });
    const totalRevenue = activeInvs.reduce((sum, inv) => sum + (inv.package?.price || 0), 0);

    return { totalInvitations, pendingPayment, activeInvitations, totalRevenue };
  }

  async getRecentInvitations() {
    return this.prisma.invitation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: { user: { select: { fullName: true, email: true } }, category: true, package: true }
    });
  }

  async approveInvitation(id: number) {
    const inv = await this.prisma.invitation.findUnique({ where: { id } });
    if (!inv) throw new NotFoundException('Davetiye bulunamadı');
    return this.prisma.invitation.update({ where: { id }, data: { status: 'ACTIVE' } });
  }

  // YENİ: Davetiyeyi Yayından Kaldır (Süresi Bitenler İçin)
  async expireInvitation(id: number) {
    const inv = await this.prisma.invitation.findUnique({ where: { id } });
    if (!inv) throw new NotFoundException('Davetiye bulunamadı');
    return this.prisma.invitation.update({ where: { id }, data: { status: 'EXPIRED' } });
  }

  // YENİ: Paketleri Getir
  async getPackages() {
    return this.prisma.package.findMany({ orderBy: { price: 'asc' } });
  }

  // YENİ: Paketi Güncelle (Fiyat, Özellik vb.)
  async updatePackage(id: number, data: any) {
    return this.prisma.package.update({
      where: { id },
      data: {
        price: data.price,
        hasMusic: data.hasMusic,
        hasRsvp: data.hasRsvp,
        hasMap: data.hasMap,
        isActive: data.isActive
      }
    });
  }




  // ==========================================
  // KATEGORİ YÖNETİMİ
  // ==========================================
  
  async getCategories() {
    // Tüm kategorileri getirir (Pasif olanlar dahil)
    return this.prisma.category.findMany({ orderBy: { id: 'asc' } });
  }

  // 1. KATEGORİ EKLEME (Eksikti, eklendi ve slug otomatik üretiliyor)
  async createCategory(data: any) {
    const slug = data.name.toLowerCase().trim().replace(/[\s\W-]+/g, '-');
    return this.prisma.category.create({
      data: {
        name: data.name,
        slug: slug,
        icon: data.icon || '📌',
        description: data.description || '',
        isActive: true,
      }
    });
  }

  // 2. PAKET EKLEME (Veritabanı alanları birebir eşleştirildi)
  async createPackage(data: any) {
    return this.prisma.package.create({
      data: {
        name: data.name,
        price: Number(data.price),
        description: data.description,
        type: data.type || 'ADDON',
        addonKey: data.addonKey || null,
        hasMusic: data.hasMusic || false,
        hasRsvp: data.hasRsvp || false,
        hasMap: data.hasMap || false,
        hasGallery: data.hasGallery || false,
        isPremium: data.isPremium || false,
        isActive: true
      }
    });
  }

  async updateCategory(id: number, data: any) {
    return this.prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        icon: data.icon,
        description: data.description,
        isActive: data.isActive
      }
    });
  }

  // ==========================================
  // TEMA (TASARIM) YÖNETİMİ
  // ==========================================
  
  async getThemes() {
    return this.prisma.theme.findMany({
      include: { categories: true }, // Temanın bağlı olduğu kategorileri de getir
      orderBy: { id: 'desc' }
    });
  }

  async createTheme(data: any) {
    const themeId = data.name.toLowerCase().trim().replace(/[\s\W-]+/g, '-');
    
    return this.prisma.theme.create({
      data: {
        name: data.name,
        themeId: themeId,
        icon: data.icon || '🎨',
        coverImage: data.coverImage,
        fontFamily: data.fontFamily || 'font-serif',
        primaryColor: data.primaryColor,
        animation: data.animation || 'fade-in',
        isActive: data.isActive ?? true,
        // Kategori ID'lerini Prisma'nın anlayacağı formata çeviriyoruz
        categories: {
          connect: data.categoryIds?.map((id: number) => ({ id })) || []
        }
      }
    });
  }

  async updateTheme(id: number, data: any) {
    return this.prisma.theme.update({
      where: { id },
      data: {
        name: data.name,
        icon: data.icon,
        coverImage: data.coverImage,
        fontFamily: data.fontFamily,
        primaryColor: data.primaryColor,
        animation: data.animation,
        isActive: data.isActive,
        categories: {
          set: [], // Önce mevcut eşleşmeleri temizle
          connect: data.categoryIds?.map((catId: number) => ({ id: catId })) || [] // Sonra yenilerini bağla
        }
      }
    });
  }

}