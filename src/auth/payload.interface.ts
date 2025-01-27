import { Role } from 'src/common/enums/role.enum';

export interface payloadInterface {
  id: number;
  email: string;
  username: string;
  role: Role;
}
