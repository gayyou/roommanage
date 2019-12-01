import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import store from "@/store/store";
import {getToken, setToken} from "@/utils/shared/localStorage";
import {userRequest} from "@/api/UserRequest";
import {getResultResData} from "@/utils/shared/formate";
import {sitRequest} from "@/api/SitRequest";

@Module({
  dynamic: true,
  store,
  name: 'SitManage',
})
class SitManage extends VuexModule {
  public sitList: {
    sitId: number;
    roomId: string;
    roomType: string;
    storeId: number;
    money: number
  }[] = [];

  @Mutation
  public setSitList(list: {
    sitId: number;
    roomId: string;
    roomType: string;
    storeId: number;
    money: number
  }[]) {
    this.sitList = list;
  }

  @Action
  public async getSitList(data: {
    roomId: string;
    roomType: string;
    storeId: number;
  }) {
    let result = getResultResData(await sitRequest.getSitList(data));
    if (result.isSuccess) {
      let arr: {
        sitId: number;
        roomId: string;
        roomType: string;
        storeId: number;
        money: number
      }[] = [];

      for (let i = 0; i < result.data.length; i++) {
        let item = result.data[i];
        arr.push({
          sitId: item.sitId,
          roomType: item.roomType,
          roomId: item.roomId,
          storeId: item.storeId,
          money: item.money
        });
      }

      this.setSitList(arr);
    }

    return result;
  }

  @Action
  public async addSit(data: {
    roomId: string;
    roomType: string;
    sitId: number;
    storeId: number;
    money: number;
  }) {
    return getResultResData(await sitRequest.addSitInfo(data));
  }

  @Action
  public async updateSit(data: {
    roomId: string;
    roomType: string;
    sitId: number;
    storeId: number;
    money: number;
  }) {
    return getResultResData(await sitRequest.updateSitInfo(data));
  }

  @Action
  public async removeSit(data: {
    sitId: number;
    roomType: string;
    roomId: string;
    storeId: number;
  }) {
    return getResultResData(await sitRequest.removeSit(data));
  }
}

export const sitManage = getModule(SitManage);
