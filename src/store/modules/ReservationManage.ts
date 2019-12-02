import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import store from "@/store/store";
import {getToken, setToken} from "@/utils/shared/localStorage";
import {userRequest} from "@/api/UserRequest";
import {getResultResData} from "@/utils/shared/formate";
import {reservationRequest} from "@/api/ReservationRequest";

@Module({
  dynamic: true,
  store,
  name: 'ReservationManage',
})
class ReservationManage extends VuexModule {
  public reservationList: {
    preservationId: number;
    sitId: number;
    roomId: string;
    storeName: string;
    date: string;
    name: string;
    phone: string;
    roomType: string;
  }[] = [];

  @Mutation
  public setReservationList(list: {
    preservationId: number;
    sitId: number;
    roomId: string;
    storeName: string;
    date: string;
    name: string;
    phone: string;
    roomType: string;
  }[]) {
    this.reservationList = list;
  }

  @Action
  public async getReservationList(data: {
    date: string;
  }) {
    let result = getResultResData(await reservationRequest.getReservationList(data));
    if (result.isSuccess) {
      let reservationList: any[] = [];
      for (let i = 0; i < result.data.length; i++) {
        let item = result.data[i];
        reservationList.push({
          preservationId: item.preservationId,
          sitId: item.sitId,
          roomId: item.roomId,
          storeName: item.storeName,
          date: item.preservationDate,
          name: item.name,
          phone: item.tel,
          roomType: item.roomType
        });
      }
      this.setReservationList(reservationList);
    }

    return result;
  }

  @Action
  public async deleteReservation(data: {
    pid: number;
  }) {
    return getResultResData(await reservationRequest.deleteReservation(data));
  }
}

export const reservationManage = getModule(ReservationManage);
