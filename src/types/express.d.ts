import { UserDto } from '../user/dto/user.dto';

declare global {
  namespace Express {
    interface Request {
      user: UserDto;
    }
  }
}
