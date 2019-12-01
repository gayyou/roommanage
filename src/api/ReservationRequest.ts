import {Request} from "@/api/config";
import {getReqDataSequence} from "@/utils/shared";

class ReservationRequest extends Request {
  public getReservationList(data: {
    date: string;
  }) {
    return this.get('/preserve/listRecord?' + getReqDataSequence(data));
  }

  public deleteReservation(data: {
    pid: number;
  }) {
    return this.post('/preserve/deleteRecord', data);
  }
}

export const reservationRequest = new ReservationRequest();
