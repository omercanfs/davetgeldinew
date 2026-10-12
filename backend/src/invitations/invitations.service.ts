import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvitationsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    try {
      const baseSlug = (data.brideName || 'davetiye').toLowerCase().trim().replace(/[\s\W-]+/g, '-');
      const randomNum = Math.floor(Math.random() * 10000);
      const uniqueSlug = data.slug || `${baseSlug}-${randomNum}`;

      const safeCategoryId = data.categoryId ? Number(data.categoryId) : 1;
      const safePackageId = data.packageId ? Number(data.packageId) : 1;
      const safeThemeId = data.themeId ? String(data.themeId) : '1';
      const safeUserId = data.userId ? Number(data.userId) : 1;

      const safeDate = (dateStr: string, fallbackStr: string) => {
        if (!dateStr) return new Date(fallbackStr);
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? new Date(fallbackStr) : d;
      };
      const primaryDateStr = data.eventDate ? new Date(data.eventDate).toISOString() : new Date().toISOString();

      return await this.prisma.invitation.create({
        data: {
          brideName: data.brideName || 'Belirtilmedi',
          groomName: data.groomName || null,
          eventDate: new Date(primaryDateStr),
          
          locationName: data.locationName || 'Mekan Belirtilmedi',
          fullAddress: data.fullAddress || 'Adres bilgisi daha sonra eklenecektir.',
          
          mapCoordinates: data.mapCoordinates || null,
          bankAccountName: data.bankAccountName || null,
          bankIban: data.bankIban || null,
          bankMessage: data.bankMessage || null,
          
          storyTitle: data.storyTitle || '',
          storyContent: data.storyContent || '',
          
          slug: uniqueSlug,
          userId: safeUserId,
          categoryId: safeCategoryId,
          packageId: safePackageId,
          themeId: safeThemeId,
          status: 'PENDING_PAYMENT',
          totalPrice: data.totalPrice ? Number(data.totalPrice) : 0,
          addons: data.addons || [],
          isPremium: false,
          isRsvpClosed: false,

          milestones: {
            create: Array.isArray(data.milestones) ? data.milestones.map((m: any) => ({
              title: m.title || "Belirtilmedi",
              date: safeDate(m.date, primaryDateStr),
              description: m.description || ""
            })) : []
          },

          eventStops: {
            create: Array.isArray(data.eventStops) ? data.eventStops.map((e: any) => ({
              title: e.title || "Belirtilmedi",
              date: safeDate(e.date, primaryDateStr),
              timeString: e.timeString || "",
              locationName: e.locationName || "",
              address: e.address || "",
              dressCode: e.dressCode || "",
              parkingInfo: e.parkingInfo || "",
              valeInfo: e.valeInfo || "",
              accomodation: e.accomodation || ""
            })) : []
          }
        },
      });
    } catch (error: any) { 
      console.error("DAVETİYE KAYIT HATASI:", error);
      throw new Error(`Veritabanına kaydedilirken bir hata oluştu: ${error?.message || 'Bilinmeyen hata'}`);
    }
  }

  findAll() {
    return this.prisma.invitation.findMany({
      orderBy: { createdAt: 'desc' },
      include: { guests: true, user: true, gallery: true, package: true, category: true},
    });
  }

  async findBySlug(slug: string) {
    try {
      const invitation = await this.prisma.invitation.findFirst({
        where: { slug: slug },
        include: { eventStops: true, milestones: true }
      });

      if (!invitation) return null;

      let themeData = null;
      let packageData = null;

      if (invitation.themeId) {
        themeData = await this.prisma.theme.findFirst({
          where: { id: Number(invitation.themeId) }
        }).catch(() => null); 
      }

      if (invitation.packageId) {
        packageData = await this.prisma.package.findFirst({
          where: { id: Number(invitation.packageId) }
        }).catch(() => null);
      }

      return {
        ...invitation,
        theme: themeData,
        package: packageData
      };
    } catch (error) {
      console.error("Davetiye çekilirken hata oluştu:", error);
      return null;
    }
  }

  findOne(id: number) {
    return this.prisma.invitation.findUnique({
      where: { id },
      include: { guests: true, user: true, gallery: true, eventStops: true, milestones: true, package: true, category: true },
    });
  }

  findByUser(userId: number) {
    return this.prisma.invitation.findMany({
      where: { userId },
      include: { guests: true, gallery: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async update(id: number, rawData: any) {
    const { milestones, eventStops, eventTime, ...updatePayload } = rawData;
    
    const safeDate = (dateStr: string, fallbackStr: string) => {
      if (!dateStr) return new Date(fallbackStr);
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? new Date(fallbackStr) : d;
    };

    if (updatePayload.eventDate) {
      updatePayload.eventDate = new Date(updatePayload.eventDate);
    }

    if (milestones && Array.isArray(milestones)) {
      updatePayload.milestones = {
        deleteMany: {}, 
        create: milestones.map((m: any) => ({
          title: m.title || "Belirtilmedi",
          date: safeDate(m.date, updatePayload.eventDate?.toISOString() || new Date().toISOString()),
          description: m.description || ""
        }))
      };
    }

    if (eventStops && Array.isArray(eventStops)) {
      updatePayload.eventStops = {
        deleteMany: {}, 
        create: eventStops.map((e: any) => ({
          title: e.title || "Belirtilmedi",
          date: safeDate(e.date, updatePayload.eventDate?.toISOString() || new Date().toISOString()),
          timeString: e.timeString || e.time || "",
          locationName: e.locationName || e.location || "",
          address: e.address || "",
          dressCode: e.dressCode || "",
          parkingInfo: e.parkingInfo || "",
          valeInfo: e.valeInfo || "",
          accomodation: e.accomodation || ""
        }))
      };
    }

    return this.prisma.invitation.update({
      where: { id: Number(id) },
      data: updatePayload, 
    });
  }

  remove(id: number) {
    return this.prisma.invitation.delete({
      where: { id },
    });
  }

  async addGalleryImages(invitationId: number, files: any[]) {
    const galleryData = files.map((file, index) => ({
      invitationId: Number(invitationId),
      imageUrl: `http://127.0.0.1:3000/uploads/${file.filename}`,
      order: index
    }));

    await this.prisma.gallery.createMany({
      data: galleryData,
    });
    return { success: true, message: "Fotoğraflar başarıyla yüklendi" };
  }

  async deleteGalleryImage(imageId: number) {
    return this.prisma.gallery.delete({
      where: { id: Number(imageId) }
    });
  }
}