<style lang="scss" scoped>
@import "scss/mixin";
.package-manage-container {
  position: relative;
  width: 100%;
  padding: 0px 20px 20px 20px;
  border-radius: 8px;
  min-height: 90vh;

  .operate-container {
    @include vertical-center;
    position: relative;
  }
}
</style>

<template>
  <div class="package-manage-container">
    <custom-header
      name="套餐管理"
      :no-slot="true"
      @on-search="searchUser"
      @on-add="addUser"
    ></custom-header>
    <custom-table
      :data="displayData"
      :columns="columns"
      style="margin-top: .2rem"
    >
      <template
        slot-scope="{ index }"
        slot="action"
      >
        <div class="operate-container">
          <word-button
            type="primary"
            @click="packageBuyInfo(index)"
          >消费记录</word-button>
          <word-button
            type="primary"
            style="margin-left: .2rem"
            @click="editUser(index)"
          >编辑</word-button>
          <word-button
            type="delete"
            style="margin-left: .2rem"
            @click="confirmAddToBlackList(index)"
          >加进黑名单</word-button>
          <word-button
            type="delete"
            style="margin-left: .2rem"
            @click="confirmDeleteUser(index)"
          >删除</word-button>
        </div>
      </template>
    </custom-table>
    <Page
      :total="filteredData.length"
      style="margin-top: .4rem"
      @on-change="changePage"
    />
    <Modal
      v-model="deleteModal.isShow"
      title="删除操作"
      @on-ok="deleteHandler"
    >
      <p>确定删除用户：<span style="color:rgba(65,140,95,1);font-weight: bold">{{ deleteModal.message }}</span>吗？</p>
    </Modal>
    <Modal
      v-model="addToBlackListModal.isShow"
      title="加入黑名单操作"
      @on-ok="addToBlackList"
    >
      <p>确定将用户：<span style="color:rgba(65,140,95,1);font-weight: bold">{{ addToBlackListModal.message }}</span>加入黑名单吗？</p>
    </Modal>
    <edit-user-info
      v-if="editUserInfoManage.isShow"
      :name="editUserInfoManage.name"
      :id="editUserInfoManage.id"
      :money="editUserInfoManage.money"
      :score="editUserInfoManage.score"
      :phone="editUserInfoManage.phone"
      :sex="editUserInfoManage.sex"
      @on-close="closeEditUserInfoLayer"
      @on-renew="getUserList"
    ></edit-user-info>
    <buy-list
      v-if="buyListManage.isShow"
      :user-id="buyListManage.userId"
      :user-name="buyListManage.userName"
      @on-close="closeBuyListLayer"
    ></buy-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import CustomHeader from "@/components/customHeader/CustomHeader.vue";
import CustomTable from "@/components/customTable/CustomTable.vue";
import WordButton from "@/components/wordButton/WordButton.vue";
import {operationFailMsg, operationSuccessMsg} from '@/utils/shared/message';
import {packageManage} from "@/store/modules/PackageManage";
import {userListManage} from "@/store/modules/UserListManage";
import BuyList from "@/views/userManage/userInfo/buyList/BuyList.vue";
import EditUserInfo from "@/views/userManage/userInfo/editUserInfo/EditUserInfo.vue";
@Component({
  components: {EditUserInfo, BuyList, WordButton, CustomTable, CustomHeader}
})
export default class UserInfo extends Vue {
  get userInfoList() {
    return userListManage.userInfoList;
  }

  columns: any[] = [
    {
      title: '序号',
      key: 'index'
    },
    {
      title: '用户名',
      key: 'name'
    },
    {
      title: '用户信息',
      key: 'detail'
    },
    {
      title: '电话',
      key: 'phone'
    },
    {
      title: '余额',
      key: 'money'
    },
    {
      title: '积分',
      key: 'score'
    },
    {
      title: '来这里的目的',
      key: 'target'
    },
    {
      title: '操作',
      slot: 'action'
    }
  ];

  displayData: {
    index: number;
    id: number;
    detail: string;
    money: number;
    target: string;
    score: number;
    name: string;
    phone: string;
    job: string;
    birthday: string;
    sex: string;
    url: string;
  }[] = [

  ];

  filteredData: {
    index: number;
    id: number;
    sex: string;
    money: number;
    detail: string;
    target: string;
    score: number;
    name: string;
    phone: string;
    job: string;
    birthday: string;
    url: string;
  }[] = [

  ];

  deleteModal: any = {
    isShow: false,
    message: ''
  };

  addToBlackListModal: any = {
    isShow: false,
    message: ''
  };

  searchValue: string = '';

  deleteUserId: number = -1;

  addToBlackUserId: number = -1;

  addToBlackPhone: string = '';

  page: number = 1;

  buyListManage: any = {
    isShow: false,
    userId: -1,
    userName: ''
  };

  editUserInfoManage: any = {
    isShow: false,
    money: 0,
    score: 0,
    id: -1,
    name: '',
    phone: '',
    sex: ''
  };

  closeBuyListLayer() {
    this.buyListManage.isShow = false;
  }

  closeEditUserInfoLayer() {
    this.editUserInfoManage.isShow = false;
  }

  searchUser(value: string) {
    this.searchValue = value;
    this.changeFilteredData();
  }

  packageBuyInfo(index: number) {
    this.buyListManage.userId = this.displayData[index].id;
    this.buyListManage.userName = this.displayData[index].name;
    this.buyListManage.isShow = true;
  }

  editUser(index: number) {
    let item = this.displayData[index];
    this.editUserInfoManage = {
      isShow: true,
      money: item.money,
      score: item.score,
      id: item.id,
      name: item.name,
      phone: item.phone,
      sex: item.sex
    };
  }

  addUser() {
    this.editUserInfoManage = {
      isShow: true,
      money: 0,
      score: 0,
      id: -1,
      name: '',
      phone: '',
      sex: ''
    };
  }

  addToBlackList() {
    if (this.addToBlackUserId == -1) {
      return ;
    }
    userListManage.addToBlackList({
      userId: this.addToBlackUserId,
      tel: this.addToBlackPhone
    }).then(res => {
      if (res.isSuccess) {
        operationSuccessMsg('加入黑名单成功');
        this.getUserList();
      } else {
        operationFailMsg('操作失败');
      }
    });
  }

  confirmAddToBlackList(index: number) {
    this.addToBlackListModal.message = this.displayData[index].name;
    this.addToBlackListModal.isShow = true;
    this.addToBlackUserId = this.displayData[index].id;
    this.addToBlackPhone = this.displayData[index].phone;
  }

  confirmDeleteUser(index: number) {
    this.deleteModal.message = this.displayData[index].name;
    this.deleteModal.isShow = true;
    this.deleteUserId = this.displayData[index].id;
  }

  deleteHandler() {
    if (this.deleteUserId == -1) {
      return ;
    }
    userListManage.deleteUser({
      userId: this.deleteUserId
    }).then(res => {
      if (res.isSuccess) {
        operationSuccessMsg('删除用户成功');
        this.getUserList();
      } else {
        operationFailMsg('删除用户失败');
      }
    });
  }

  getUserList() {
    userListManage.getUserInfoList().then(res => {
      if (res.isSuccess) {
        this.changeFilteredData();
      } else {
        operationFailMsg('获取数据失败');
      }
    });
  }

  changePage(page: number) {
    this.page = page;
    this.changeDisplayData();
  }

  changeDisplayData() {
    this.displayData = [];
    for (let i = (this.page - 1) * 10; i < this.page * 10 && i < this.filteredData.length; i++) {
      this.displayData.push(this.filteredData[i]);
    }
  }

  changeFilteredData() {
    this.filteredData = [];
    let count = 1;
    for (let i = 0; i < this.userInfoList.length; i++) {
      let item = this.userInfoList[i];
      if (item.name.indexOf(this.searchValue) != -1
        || item.phone.indexOf(this.searchValue) != -1
        || this.searchValue.length == 0) {
        this.filteredData.push({
          index: count++,
          score: item.score,
          sex: item.sex,
          phone: item.phone,
          job: item.job,
          target: item.target,
          birthday: item.birthday,
          url: item.url,
          id: item.id,
          money: item.money,
          name: item.name,
          detail: '生日:' + item.birthday+ ';职业: ' + item.job
        });
      }
    }
    this.changeDisplayData();
  }

  beforeMount() {
    let screenWidth: number = window.screen.availWidth;
    let tableWidthList: number[] = [100, 180, 250, 180, 150, 150, 250, 335];  // 总的1600
    for (let i = 0; i < this.columns.length; i++) {
      this.columns[i].width = tableWidthList[i] * (screenWidth / 1920);
    }
  }

  created() {
    this.getUserList();
  }
}
</script>
