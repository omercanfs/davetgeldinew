export class CreateGuestDto {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  guestCount?: number;
  message?: string;
  invitationId: number;
}