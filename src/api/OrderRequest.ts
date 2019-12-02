import {Request} from "@/api/config";
import {getReqDataSequence} from "@/utils/shared";

class OrderRequest extends Request {
  public getOrderList(data: {
    orderType?: string;
    orderDate: string;
  }) {
    console.log(data);
    return this.get('/order/listOrderByType?' + getReqDataSequence(data));
  }

  public deleteOrder(data: {
    orderId: number;
  }) {
    return this.post('/order/deleteOrder', data);
  }
}

export const orderRequest = new OrderRequest();
