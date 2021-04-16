export interface commandType {
  keyword: string;
  description: string;
  roles: {
    allRoles: boolean;
    consentedRoles: string[];
  };
  channels: string[];
  action: boolean;
  reply: any;
  id?: string;
}
