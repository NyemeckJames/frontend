export interface Address {
  id: number;
  name: string;
  location_title: string;
  latitude: number;
  longitude: number;
  additional_contact_name: string;
  additional_contact_phone: string;
  delivery_track_id: string;
}

export interface Speaker {
  id: number;
  name: string;
  occupation?: string;
  facebook?: string;
  linkedin?: string;
  photo?: string;
}

export interface Ticket {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface EventGallery {
  id: number;
  image: string;
}

export interface Event {
  id: number;
  name: string;
  description?: string;
  category: string;
  start_datetime: string;
  end_datetime?: string;
  timezone?: string;
  country?: string;
  online_link?: string;
  capacity: number;
  ticket_open_date?: string;
  ticket_close_date?: string;
  organizer_name: string;
  organizer_contact: string;
  organizer_website?: string;
  cover_image?: string;
  promo_video?:string;
  confirmation_email?: string;
  reminder_messages: boolean;
  qr_code: boolean;
  qr_code_image: string;
  access_control: boolean;
  moderation: boolean;
  created_at: string;
  updated_at: string;
  addresses: Address[];
  speakers: Speaker[];
  tickets: Ticket[];
  tags: [];
  gallery: EventGallery[];
}
