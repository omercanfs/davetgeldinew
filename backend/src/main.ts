import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; // EKLENDİ
import { join } from 'path'; // EKLENDİ

async function bootstrap() {
  // Express altyapısını kullandığımızı belirtiyoruz
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors(); // React'in bağlanabilmesi için

  // YENİ EKLENDİ: /uploads klasöründeki resimleri internete açıyoruz
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(3000);
}
bootstrap();