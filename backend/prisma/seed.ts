import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Veritabanı çekirdek verileri (Seed) yükleniyor...');

  // 1. KATEGORİLERİ EKLE
  const categories = [
    { name: 'Düğün, Nikah, Nişan', slug: 'dugun-nisan', icon: '💍', description: 'En mutlu gününüz için zarif tasarımlar.' },
    { name: 'Doğum Günü', slug: 'dogum-gunu', icon: '🎂', description: 'Yeni yaşınızı harika bir davetiye ile kutlayın.' },
    { name: 'Baby Shower', slug: 'baby-shower', icon: '🍼', description: 'Bebeğinizin gelişini sevdiklerinizle paylaşın.' },
    { name: 'Sünnet', slug: 'sunnet', icon: '🎈', description: 'Oğlunuzun bu özel gününü unutulmaz kılın.' },
    { name: 'Toplantı / Kurumsal', slug: 'kurumsal', icon: '🏢', description: 'Şirket etkinlikleriniz için profesyonel çözümler.' },
    { name: 'Parti / Bekarlığa Veda', slug: 'parti', icon: '🪩', description: 'Eğlencenin dibine vuracağınız o geceye çağrı.' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('✅ Kategoriler eklendi!');

  // 2. PAKETLERİ VE FİYATLARI EKLE
  const packages = [
    { 
      name: 'Standart Paket', price: 299.90, isPremium: false,
      hasMusic: false, hasRsvp: true, hasMap: true, hasGallery: false 
    },
    { 
      name: 'Premium Paket', price: 499.90, isPremium: true,
      hasMusic: true, hasRsvp: true, hasMap: true, hasGallery: true 
    }
  ];

  for (const pkg of packages) {
    // İsme göre kontrol edip ekliyoruz
    const exists = await prisma.package.findFirst({ where: { name: pkg.name } });
    if (!exists) {
      await prisma.package.create({ data: pkg });
    }
  }
  console.log('✅ Paketler eklendi!');

  // 3. İLK ADMİN KULLANICISINI OLUŞTUR (Giriş yapabilmen için)
  const adminEmail = 'admin@davetgeldi.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: '123456', // Gerçek senaryoda bcrypt ile şifrelenmeli
        fullName: 'Sistem Yöneticisi',
        role: 'ADMIN' // İşte o beklediğimiz yetki!
      }
    });
    console.log('✅ Admin hesabı eklendi! (admin@davetgeldi.com / 123456)');
  }

  // 4. TEMALARI VE KATEGORİ BAĞLANTILARINI EKLE
  console.log('🎨 Temalar yükleniyor...');
  
  // Önce kategorileri bulalım
  const weddingCat = await prisma.category.findUnique({ where: { slug: 'dugun-nisan' } });
  const birthdayCat = await prisma.category.findUnique({ where: { slug: 'dogum-gunu' } });
  const babyCat = await prisma.category.findUnique({ where: { slug: 'baby-shower' } });
  const corporateCat = await prisma.category.findUnique({ where: { slug: 'kurumsal' } });

  const themesData = [
    { name: 'Yasemin Perdesi', themeId: 'yasemin-perdesi', icon: '🌿', primaryColor: '#3b4033', fontFamily: 'font-serif', coverImage: 'https://images.unsplash.com/...', categoryIds: weddingCat ? [weddingCat.id] : [] },
    { name: 'Kapadokya', themeId: 'kapadokya', icon: '🎈', primaryColor: '#5e381b', fontFamily: 'font-serif', coverImage: 'https://images.unsplash.com/...', categoryIds: birthdayCat ? [birthdayCat.id, babyCat ? babyCat.id : 0] : [] },
    { name: 'Sütun Perdesi', themeId: 'sutun-perdesi', icon: '🏛️', primaryColor: '#362f2c', fontFamily: 'font-serif', coverImage: '', categoryIds: weddingCat ? [weddingCat.id, corporateCat ? corporateCat.id : 0] : [] },
    { name: 'Işık Bahçesi', themeId: 'isik-bahcesi', icon: '✨', primaryColor: '#eab308', fontFamily: 'font-sans', coverImage: '', categoryIds: birthdayCat ? [birthdayCat.id] : [] },
  ];

  for (const t of themesData) {
    const exists = await prisma.theme.findUnique({ where: { themeId: t.themeId } });
    if (!exists) {
      await prisma.theme.create({
        data: {
          name: t.name,
          themeId: t.themeId,
          icon: t.icon,
          primaryColor: t.primaryColor,
          fontFamily: t.fontFamily,
          coverImage: t.coverImage,
          categories: {
            connect: t.categoryIds.filter(id => id > 0).map(id => ({ id }))
          }
        }
      });
    }
  }
  console.log('✅ Temalar eklendi!');

  
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });