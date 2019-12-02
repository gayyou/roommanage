import {Request} from "@/api/config";

class UserRequest extends Request {
  login(data: {
    username: string;
    psw: string;
  }) {
    return this.post('/user/login', data);
  }

  exit() {
    return this.post('/user/exit', {});
  }
}

export const userRequest = new UserRequest();
