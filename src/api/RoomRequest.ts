import {Request} from "@/api/config";
import {getReqDataSequence} from "@/utils/shared";

class RoomRequest extends Request {
  public setPreTime(data: {
    preTime: number;
  }) {
    return this.post('/user/updatePreTime', data);
  }

  public getPreTime() {
    return this.get('/user/getPreTime');
  }

  public getRoomList(data: {
    storeId: number;
  }) {
    return this.get('/room/listRoom?' + getReqDataSequence(data));
  }

  public addRoom(data: {
    roomId: string;
    roomType: string;
    storeId: number;
  }) {
    return this.post('/room/addRoom', data);
  }

  public removeRoom(data: {
    roomId: string;
    roomType: string;
    storeId: number;
  }) {
    return this.post('/room/deleteRoom', data);
  }
}

export const roomRequest = new RoomRequest();
