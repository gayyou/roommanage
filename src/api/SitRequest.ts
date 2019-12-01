import {Request} from "@/api/config";
import {getReqDataSequence} from "@/utils/shared";

class SitRequest extends Request {
  public getSitList(data: {
    roomId: string;
    roomType: string;
    storeId: number;
  }) {
    return this.post('/sit/listSit', data);
  }

  public removeSit(data: {
    sitId: number;
    roomType: string;
    roomId: string;
    storeId: number;
  }) {
    return this.post('/sit/deleteSit', data);
  }

  public updateSitInfo(data: {
    roomId: string;
    roomType: string;
    sitId: number;
    storeId: number;
    money: number;
  }) {
    return this.post('/sit/updateSit', data);
  }

  public addSitInfo(data: {
    roomId: string;
    roomType: string;
    sitId: number;
    storeId: number;
    money: number;
  }) {
    return this.post('/sit/addSit', data);
  }
}

export const sitRequest = new SitRequest();
