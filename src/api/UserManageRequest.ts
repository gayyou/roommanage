import {Request} from "@/api/config";
import {getReqDataSequence} from "@/utils/shared";

class UserManageRequest extends Request {
  public getUserMoney(data: {
    userId: number
  }) {
    return this.get('/user/listUserMoneyById?' + getReqDataSequence(data));
  }

  public getUserInfoList() {
    return this.get('/user/listAllUser');
  }

  public getBlackList() {
    return this.get('/user/listBlackList');
  }

  public getUserInfoByName(data: {
    name: string;
  }) {
    return this.get('/user/querySpecifyUser?' + getReqDataSequence(data));
  }

  public updateUserInfo(data: {
    userId: number;
    name: string;
    tel: string;
    sex: string;
    rareMoney: number;
    score: number;
  }) {
    return this.post('/user/modifyUser', data);
  }

  public deleteUser(data: {
    userId: number;
  }) {
    return this.post('/user/deleteUser', data);
  }

  public addToBlackList(data: {
    userId: number;
    tel: string;
  }) {
    return this.post('/user/moveToBlackList', data);
  }

  public removeFromBlackList(data: {
    userId: number;
  }) {
    return this.post('/user/removeUserFromBlackList', data);
  }

  public addUser(data: {
    name: string;
    tel: string;
    sex: string;
    rareMoney: number;
    score: number;
  }) {
    return this.post('/user/addUser', data);
  }
}

export const userManageRequest = new UserManageRequest();
