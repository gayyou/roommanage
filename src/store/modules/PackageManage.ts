import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import store from "@/store/store";
import {getToken, setToken} from "@/utils/shared/localStorage";
import {userRequest} from "@/api/UserRequest";
import {getResultResData} from "@/utils/shared/formate";
import {packageRequest} from "@/api/PackageRequest";

@Module({
  dynamic: true,
  store,
  name: 'PackageManage',
})
class PackageManage extends VuexModule {
  public packageList: {
    id: number;
    money: number;
    type: string;
    detail: string;
    days: number;
    name: string;
    times: number;
  }[] = [];

  @Mutation
  public setPackageList(list: {
    id: number;
    money: number;
    type: string;
    detail: string;
    days: number;
    name: string;
    times: number;
  }[]) {
    this.packageList = list;
  }

  @Action
  public async getPackageList() {
    let result = getResultResData(await packageRequest.getPackageList());
    if (result.isSuccess) {
      let resultArr: {
        id: number;
        money: number;
        type: string;
        detail: string;
        days: number;
        name: string;
        times: number;
      }[] = [];
      for (let i = 0; i < result.data.length; i++) {
        let item = result.data[i];
        resultArr.push({
          id: item.mealId,
          money: item.mealMoney,
          type: item.mealType,
          detail: item.mealDesc,
          days: item.mealDays,
          name: item.mealName,
          times: item.usedTime
        });
      }
      this.setPackageList(resultArr);
    }

    return result;
  }

  @Action
  public async addPackage(data: {
    mealName: string;
    mealDays: number;
    mealType: string;
    mealMoney: number;
    mealDesc: string;
    usedTime: number;
  }) {
    return getResultResData(await packageRequest.addPackage(data));
  }

  @Action
  public async updatePackage(data: {
    mealId: number;
    mealName: string;
    mealDays: number;
    mealType: string;
    mealMoney: number;
    mealDesc: string;
    usedTime: number;
  }) {
    return getResultResData(await packageRequest.updatePackage(data));
  }

  @Action
  public async deletePackage(data: {
    mealId: number;
  }) {
    return getResultResData(await packageRequest.deletePackage(data));
  }

  @Action
  public async getPackageHistory(data: {
    mealId: number;
  }) {
    return getResultResData(await packageRequest.getPackageHistory(data));
  }
}

export const packageManage = getModule(PackageManage);
