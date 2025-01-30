import { AccountRole } from '../../user/enum/account-role.enum';

export interface JwtPayload {
  id: string;
  email: string;
  role: AccountRole;
}
