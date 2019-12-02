import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import store from "@/store/store";
import {getResultResData} from "@/utils/shared/formate";
import {orderRequest} from "@/api/OrderRequest";

@Module({
  dynamic: true,
  store,
  name: 'OrderManage',
})
class OrderManage extends VuexModule {
  public rechargeList: {
    orderId: number;
    money: number;
    date: string;
    userId: number;
    type: string;
    status: string;
    userName: string;
    phone: string;
  }[] = [];

  public reservationList: {
    orderId: number;
    money: number;
    date: string;
    userId: number;
    userName: string;
    phone: string;
    sitId: number;
    storeId: number;
    roomId: number;
    storeName: string;
    status: string;
    type: string;
  }[] = [];

  public packageList: {
    orderId: number;
    money: number;
    date: string;
    userId: number;
    userName: string;
    phone: string;
    status: string;
    type: string;
  }[] = [];

  @Mutation
  public setRechargeList(list: {
    orderId: number;
    money: number;
    date: string;
    userId: number;
    type: string;
    status: string;
    userName: string;
    phone: string;
  }[]) {
    this.rechargeList = list;
  }

  @Mutation
  public setReservationList(list: {
    orderId: number;
    money: number;
    date: string;
    userId: number;
    userName: string;
    phone: string;
    sitId: number;
    storeId: number;
    roomId: number;
    storeName: string;
    status: string;
    type: string;
  }[]) {
    this.reservationList = list;
  }

  @Mutation
  public setPackageList(list: {
    orderId: number;
    money: number;
    date: string;
    userId: number;
    type: string;
    status: string;
    userName: string;
    phone: string;
  }[]) {
    this.packageList = list;
  }

  @Action
  public async getRechargeList(data: {
    orderDate: string;
    orderType?: string;
  }) {
    data.orderType = '充值订单';
    let result = getResultResData(await orderRequest.getOrderList(data));
    if (result.isSuccess) {
      let rechargeList = [];
      for (let i = 0; i < result.data.length; i++) {
        let item = result.data[i];
        rechargeList.push({
          orderId: item.orderId,
          money: item.orderMoney,
          date: item.orderDate,
          userId: item.userId,
          type: item.orderType,
          status: item.orderStatus,
          userName: item.name,
          phone: item.tel
        })
      }
      this.setRechargeList(rechargeList);
    }
    return result;
  }

  @Action
  public async getReservationList(data: {
    orderDate: string;
    orderType?: string;
  }) {
    data.orderType = '预约订单';
    let result = getResultResData(await orderRequest.getOrderList(data));
    if (result.isSuccess) {
      let reservationList = [];
      for (let i = 0; i < result.data.length; i++) {
        let item = result.data[i];
        reservationList.push({
          orderId: item.orderId,
          money: item.orderMoney,
          date: item.orderDate,
          userId: item.userId,
          userName: item.name,
          phone: item.tel,
          sitId: item.sitId,
          storeId: item.storeId,
          roomId: item.roomId,
          storeName: item.storeName,
          status: item.orderStatus,
          type: item.orderType
        })
      }
      this.setReservationList(reservationList);
    }
    return result;
  }

  @Action
  public async getPackageList(data: {
    orderDate: string;
    orderType?: string;
  }) {
    data.orderType = '套餐订单';
    let result = getResultResData(await orderRequest.getOrderList(data));
    if (result.isSuccess) {
      let packageList = [];
      for (let i = 0; i < result.data.length; i++) {
        let item = result.data[i];
        packageList.push({
          orderId: item.orderId,
          money: item.orderMoney,
          date: item.orderDate,
          userId: item.userId,
          userName: item.name,
          phone: item.tel,
          type: item.orderType,
          status: item.orderStatus
        })
      }
      this.setPackageList(packageList);
    }
    return result;
  }

  @Action
  public async deleteOrder(data: {
    orderId: number;
  }) {
    return getResultResData(await orderRequest.deleteOrder(data));
  }
}

export const orderManage = getModule(OrderManage);
