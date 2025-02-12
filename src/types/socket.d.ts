import { UserDto } from '../user/dto/user.dto';

declare module 'socket.io' {
  interface Socket {
    user: UserDto;
  }
}
