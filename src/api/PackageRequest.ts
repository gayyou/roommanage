import {Request} from "@/api/config";
import {getReqDataSequence} from "@/utils/shared";

class PackageRequest extends Request {
  public getPackageList() {
    return this.post('/meal/listAllMeal', {});
  }

  public addPackage(data: {
    mealName: string;
    mealDays: number;
    mealType: string;
    mealMoney: number;
    mealDesc: string;
    usedTime: number;
  }) {
    return this.post('/meal/addMeal', data);
  }

  public updatePackage(data: {
    mealId: number;
    mealName: string;
    mealDays: number;
    mealType: string;
    mealMoney: number;
    mealDesc: string;
    usedTime: number;
  }) {
    return this.post('/meal/modifyMeal', data);
  }

  public deletePackage(data: {
    mealId: number;
  }) {
    return this.post('/meal/deleteMeal', data);
  }

  public getPackageHistory(data: {
    mealId: number;
  }) {
    return this.get('/meal/listUserCase?' + getReqDataSequence(data));
  }
}

export const packageRequest = new PackageRequest();
