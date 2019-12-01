import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import store from "@/store/store";
import {getToken, setToken} from "@/utils/shared/localStorage";
import {userRequest} from "@/api/UserRequest";
import {getResultResData} from "@/utils/shared/formate";
import {roomRequest} from "@/api/RoomRequest";

@Module({
  dynamic: true,
  store,
  name: 'RoomManage',
})
class RoomManage extends VuexModule {
  public roomList: {
    roomId: string;
    roomType: string;
    storeId: number;
  }[] = [];

  @Mutation
  public setRoomList(list: {
    roomId: string;
    roomType: string;
    storeId: number;
  }[]) {
    this.roomList = list;
  }

  @Action
  public async setPreTime(data: {
    preTime: number;
  }) {
    return getResultResData(await roomRequest.setPreTime(data));
  }

  @Action
  public async getPreTime() {
    return getResultResData(await roomRequest.getPreTime());
  }

  @Action
  public async getRoomList(data: {
    storeId: number;
  }) {
    let result = getResultResData(await roomRequest.getRoomList(data));
    if (result.isSuccess) {
      let resultArr: {
        roomId: string;
        roomType: string;
        storeId: number;
      }[] = [];

      for (let i = 0; i < result.data.length; i++) {
        let item = result.data[i];
        resultArr.push({
          roomId: item.roomId,
          roomType: item.roomType,
          storeId: item.storeId
        });
      }
      this.setRoomList(resultArr);
    }

    return result;
  }

  @Action
  public async addRoom(data: {
    roomId: string;
    roomType: string;
    storeId: number;
  }) {
    return getResultResData(await roomRequest.addRoom(data));
  }

  @Action
  public async removeRoom(data: {
    roomId: string;
    roomType: string;
    storeId: number;
  }) {
    return getResultResData(await roomRequest.removeRoom(data));
  }
}

export const roomManage = getModule(RoomManage);
