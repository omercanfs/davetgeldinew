import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsDateString, IsNumber } from 'class-validator';

export class CreateInvitationDto {
  @IsString()
  @IsNotEmpty()
  brideName: string;

  // Damat adı doğum günü veya sünnet gibi etkinliklerde olmayacağı için opsiyonel yaptık
  @IsString()
  @IsOptional()
  groomName?: string;

  @IsDateString()
  @IsNotEmpty()
  eventDate: string;

  @IsString()
  @IsNotEmpty()
  locationName: string;

  @IsString()
  @IsNotEmpty()
  fullAddress: string;

  @IsString()
  @IsOptional()
  themeId?: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  // YENİ EKLENEN SAAS ALANLARI
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @IsNumber()
  @IsOptional()
  packageId?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsBoolean()
  @IsOptional()
  isPremium?: boolean;

  @IsString()
  @IsOptional()
  musicUrl?: string;

  @IsBoolean()
  @IsOptional()
  isRsvpClosed?: boolean;

  @IsString()
  @IsOptional()
  coverImageUrl?: string;

  @IsString()
  @IsOptional()
  storyTitle?: string;

  @IsString()
  @IsOptional()
  storyContent?: string;

  @IsString()
  @IsOptional()
  storyImageUrl?: string;

  @IsString()
  @IsOptional()
  bankAccountName?: string;

  @IsString()
  @IsOptional()
  bankIban?: string;

  @IsString()
  @IsOptional()
  bankMessage?: string;

  @IsOptional()
  milestones?: any;

  @IsOptional()
  eventStops?: any;
}