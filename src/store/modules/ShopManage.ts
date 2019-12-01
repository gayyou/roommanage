import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import store from "@/store/store";
import {shopRequest} from "@/api/ShopRequest";
import {getResultResData} from "@/utils/shared/formate";

@Module({
  dynamic: true,
  store,
  name: 'ShopManage',
})
class ShopManage extends VuexModule {
  public shopList: {
    index: number;
    name: string;
    id: number;
    address: string;
    status: number;
  }[] = [];

  @Mutation
  public setShopList(list: any) {
    this.shopList = list;
  }

  @Action
  public async getShopList() {
    let result = await shopRequest.getShopRequest();
    if (result.status == 1) {
      let list: {
        index: number;
        name: string;
        id: number;
        address: string;
        status: number;
      }[] = [];

      let resultData: any[] = result.data;

      for (let i = 0; i < resultData.length; i++) {
        list.push({
          index: i + 1,
          status: resultData[i].storeStatus,
          name: resultData[i].storeName,
          id: resultData[i].storeId,
          address: resultData[i].storeAddress
        })
      }

      this.setShopList(list);
    }

    return getResultResData(result);
  }

  @Action
  public async deleteStore(data: {
    storeId: number
  }) {
    return getResultResData(await shopRequest.deleteStore(data));
  }

  @Action
  public async addStore(data: {
    storeName: string;
    storeAddress: string;
    storeStatus: number;
  }) {
    return getResultResData(await shopRequest.addStore(data));
  }

  @Action
  public async getStoreInfo(data: {
    storeId: number
  }) {
    return getResultResData(await shopRequest.getStoreInfo(data));
  }

  @Action
  public async changeStoreInfo(data: {
    storeName: string;
    storeAddress: string;
    storeStatus: number;
    storeId: number;
  }) {
    return getResultResData(await shopRequest.changeStore(data));
  }
}

export const shopManage = getModule(ShopManage);
