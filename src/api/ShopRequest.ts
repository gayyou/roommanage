import {Request} from "@/api/config";
import {getReqDataSequence} from "@/utils/shared";

class ShopRequest extends Request {
  public getShopRequest() {
    return this.get('/store/listStore');
  }

  public deleteStore(data: {
    storeId: number
  }) {
    return this.post('/store/deleteStore', data);
  }

  public addStore(data: {
    storeName: string;
    storeAddress: string;
    storeStatus: number;
    uid: string;
  }) {
    return this.post('/store/addStore', data);
  }

  public changeStore(data: {
    storeName: string;
    storeAddress: string;
    storeStatus: number;
    storeId: number;
    uid: string;
  }) {
    return this.post('/store/modifyStore', data);
  }

  public getStoreInfo(data: {
    storeId: number
  }) {
    return this.get('/store/queryStoreByStoreId?' + getReqDataSequence(data));
  }
}

export const shopRequest = new ShopRequest();
