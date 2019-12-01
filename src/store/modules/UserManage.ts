import {Action, getModule, Module, Mutation, VuexModule} from "vuex-module-decorators";
import store from "@/store/store";
import {getToken, setToken} from "@/utils/shared/localStorage";
import {userRequest} from "@/api/UserRequest";
import {getResultResData} from "@/utils/shared/formate";

@Module({
  dynamic: true,
  store,
  name: 'UserManage',
})
class UserManage extends VuexModule {
  public userName: string = 'admin';

  public token: string = getToken() || '';

  @Mutation
  public setUserName(newName: string) {
    this.userName = newName;
  }

  @Mutation
  public setToken(token: string) {
    this.token = token;
  }

  @Action
  public async login(data: {
    username: string;
    psw: string;
  }) {
    let result = getResultResData(await userRequest.login(data));
    if (result.isSuccess) {
      this.setToken(result.data);
      setToken(result.data);
    }

    return result;
  }
}

export const userManage = getModule(UserManage);
