import {Request} from "@/api/config";
import {getReqDataSequence} from "@/utils/shared";

class RefundRequest extends Request {
  public getRefundList(data: {
    date: string;
  }) {
    return this.get('/refound/listAllRefound?' + getReqDataSequence(data));
  }

  public resolveRefund(data: {
    reId: number;
    status: string;
  }) {
    return this.post('/refound/processRefound', data);
  }

  public deleteRefund(data: {
    reId: number;
  }) {
    return this.post('/refound/deleteRefound', data);
  }
}

export const refundRequest = new RefundRequest();
