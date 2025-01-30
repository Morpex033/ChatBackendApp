import { Reflector } from '@nestjs/core';
import { AccountRole } from '../../user/enum/account-role.enum';

export const Roles = Reflector.createDecorator<AccountRole[]>();
