import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import store from "@/store/store";
import {getToken, setToken} from "@/utils/shared/localStorage";
import {userRequest} from "@/api/UserRequest";
import {getResultResData} from "@/utils/shared/formate";
import {refundRequest} from "@/api/RefundRequest";

@Module({
  dynamic: true,
  store,
  name: 'RefundManage',
})
class RefundManage extends VuexModule {
  public refundList: {
    reId: number;
    userId: number;
    phone: string;
    name: string;
    date: string;
    money: number;
    orderId: number;
    preservationId: number;
    status: string;
  }[] = [];

  @Mutation
  public setRefundList(list: {
    reId: number;
    userId: number;
    phone: string;
    name: string;
    date: string;
    money: number;
    orderId: number;
    preservationId: number;
    status: string;
  }[]) {
    this.refundList = list;
  }

  @Action
  public async resolve(data: {
    reId: number;
    status: string;
  }) {
    return getResultResData(await refundRequest.resolveRefund(data));
  }

  @Action
  public async deleteRefund(data: {
    reId: number;
  }) {
    return getResultResData(await refundRequest.deleteRefund(data));
  }

  @Action
  public async getRefundList(data: {
    date: string;
  }) {
    let result = getResultResData(await refundRequest.getRefundList(data));
    if (result.isSuccess) {
      let list: {
        reId: number;
        userId: number;
        phone: string;
        name: string;
        date: string;
        money: number;
        orderId: number;
        preservationId: number;
        status: string;
      }[] = [];
      for (let i = 0; i < result.data.length; i++) {
        let item = result.data[i];
        list.push({
          reId: item.reId,
          userId: item.userId,
          phone: item.tel,
          name: item.name,
          date: item.date,
          money: item.money,
          orderId: item.orderId,
          preservationId: item.preservationId,
          status: item.status
        });
      }
      this.setRefundList(list);
    };

    return result;


  }
}

export const refundManage = getModule(RefundManage);
