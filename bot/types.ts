export interface commandType {
  keyword: string;
  description: string;
  consentedRoles: string[];
  channels: string[];
  action: boolean;
  reply: any;
  id?: string;
}
