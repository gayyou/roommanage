import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import store from "@/store/store";
import {getToken, setToken} from "@/utils/shared/localStorage";
import {userRequest} from "@/api/UserRequest";
import {getResultResData} from "@/utils/shared/formate";
import {userManageRequest} from "@/api/UserManageRequest";

@Module({
  dynamic: true,
  store,
  name: 'UserListManage',
})
class UserListManage extends VuexModule {
  public userInfoList: {
    id: number;
    money: number;
    target: string;
    score: number;
    name: string;
    phone: string;
    sex: string;
    job: string;
    url: string;
    birthday: string;
  }[] = [];

  public blackListInfoList: {
    id: number;
    money: number;
    target: string;
    score: number;
    name: string;
    phone: string;
    sex: string;
    job: string;
    url: string;
    birthday: string;
  }[] = [];

  @Mutation
  public setUserInfoList(list: {
    id: number;
    money: number;
    target: string;
    score: number;
    name: string;
    phone: string;
    sex: string;
    job: string;
    url: string;
    birthday: string;
  }[]) {
    this.userInfoList = list;
  }

  @Mutation
  public setBlackList(list: {
    id: number;
    money: number;
    target: string;
    score: number;
    name: string;
    phone: string;
    sex: string;
    job: string;
    url: string;
    birthday: string;
  }[]) {
    this.blackListInfoList = list;
  }

  @Action
  public async getUserInfoList() {
    let result = getResultResData(await userManageRequest.getUserInfoList());
    if (result.isSuccess) {
      let resultArr: {
        id: number;
        money: number;
        target: string;
        score: number;
        name: string;
        phone: string;
        job: string;
        sex: string;
        birthday: string;
        url: string;
      }[] = [];
      for (let i = 0; i < result.data.length; i++) {
        let item = result.data[i];
        resultArr.push({
          id: item.userId,
          sex: item.sex,
          phone: item.tel,
          money: item.rareMoney,
          birthday: item.birth,
          job: item.job,
          target: item.target,
          name: item.name,
          score: item.score,
          url: item.url
        })
      }
      this.setUserInfoList(resultArr);
    }
    return result;
  }

  @Action
  public async getBlackList() {
    let result = getResultResData(await userManageRequest.getBlackList());
    if (result.isSuccess) {
      let resultArr: {
        id: number;
        money: number;
        target: string;
        score: number;
        name: string;
        phone: string;
        job: string;
        sex: string;
        birthday: string;
        url: string;
      }[] = [];
      for (let i = 0; i < result.data.length; i++) {
        let item = result.data[i];
        resultArr.push({
          id: item.userId,
          sex: item.sex,
          phone: item.tel,
          money: item.rareMoney,
          birthday: item.birth,
          job: item.job,
          target: item.target,
          name: item.name,
          score: item.score,
          url: item.url
        })
      }
      this.setBlackList(resultArr);
    }

    return result;
  }

  @Action
  public async deleteUser(data: {
    userId: number;
  }) {
    return getResultResData(await userManageRequest.deleteUser(data));
  }

  @Action
  public async addToBlackList(data: {
    userId: number;
    tel: string;
  }) {
    return getResultResData(await userManageRequest.addToBlackList(data));
  }

  @Action
  public async removeFromBlackList(data: {
    userId: number;
  }) {
    return getResultResData(await userManageRequest.removeFromBlackList(data));
  }

  @Action
  public async getUserInfoByName(data: {
    name: string
  }) {
    return getResultResData(await userManageRequest.getUserInfoByName(data));
  }

  @Action
  public async updateUserInfo(data: {
    userId: number;
    name: string;
    tel: string;
    sex: string;
    rareMoney: number;
    score: number;
  }) {
    return getResultResData(await userManageRequest.updateUserInfo(data));
  }

  @Action
  public async addUser(data: {
    name: string;
    tel: string;
    sex: string;
    rareMoney: number;
    score: number;
  }) {
    return getResultResData(await userManageRequest.addUser(data));
  }

  @Action
  public async getUsedMoneyList(data: {
    userId: number;
  }) {
    return getResultResData(await userManageRequest.getUserMoney(data));
  }
}

export const userListManage = getModule(UserListManage);
