export interface ServiceRequestType {
  service: string;
  name: string;
  phone: string;
  comment?: string;
  type?: 'order' | 'callback';
}
