<style lang="scss" scoped>
@import "scss/mixin";
@import "scss/shared";

.package-manage-container {
  position: relative;
  width: 100%;
  padding: 0px 20px 20px 20px;
  border-radius: 8px;
  min-height: 95vh;

  .operate-container {
    @include vertical-center;
    position: relative;
  }
}
</style>

<template>
  <div class="package-manage-container">
    <custom-header
      name="退款管理"
      :no-create="true"
      @on-search="searchUser"
    >
      <DatePicker
        type="date"
        format="yyyy-MM-dd"
        placeholder="选择查询日期"
        style="display: block;float: right;width: 2rem"
        :value="searchDate"
        @on-change="changeDate"
      ></DatePicker>
    </custom-header>
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
            v-if="!displayData[index].isResolved"
            type="primary"
            style="margin-right: .2rem"
            @click="resolveRefund(index)"
          >同意</word-button>
          <word-button
            v-if="!displayData[index].isResolved"
            type="delete"
            @click="rejectRefund(index)"
            style="margin-right: .2rem"
          >拒绝</word-button>
          <word-button
            type="delete"
            @click="confirmDeleteUser(index)"
          >删除</word-button>
        </div>
      </template>
    </custom-table>
    <Page
      :total="filteredData.length"
      class="turn-page-container"
      @on-change="changePage"
    />
    <Modal
      v-model="deleteModal.isShow"
      title="删除操作"
      @on-ok="deleteHandler"
    >
      <p>{{ deleteModal.title }}</p>
      <p>用户名：<span style="color:rgba(65,140,95,1);font-weight: bold">{{ deleteModal.userName }}</span></p>
      <p>用户电话：<span style="color:rgba(65,140,95,1);font-weight: bold">{{ deleteModal.phone }}</span></p>
      <p>退款申请日期：<span style="color:rgba(65,140,95,1);font-weight: bold">{{ deleteModal.date }}</span></p>
      <p>退款金额：<span style="color:rgba(65,140,95,1);font-weight: bold">{{ deleteModal.money }}</span></p>
      <p>{{ deleteModal.msg }}</p>
    </Modal>
    <Modal
      v-model="refundManage.isShow"
      title="退款操作"
      @on-ok="updateRefund"
    >
      <p>{{ refundManage.title }}</p>
      <p>用户名：<span style="color:rgba(65,140,95,1);font-weight: bold">{{ refundManage.userName }}</span></p>
      <p>用户电话：<span style="color:rgba(65,140,95,1);font-weight: bold">{{ refundManage.phone }}</span></p>
      <p>退款申请日期：<span style="color:rgba(65,140,95,1);font-weight: bold">{{ refundManage.date }}</span></p>
      <p>退款金额：<span style="color:rgba(65,140,95,1);font-weight: bold">{{ refundManage.money }}</span></p>
      <p>{{ refundManage.msg }}</p>
    </Modal>
    <Spin size="large" fix v-if="pageIsLoading" class="custom-spin">
      <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
      <div>正在获取数据...</div>
    </Spin>
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
import {refundManage} from "@/store/modules/RefundManage";
@Component({
  components: {WordButton, CustomTable, CustomHeader},
  name: 'RefundManage'
})
export default class RefundManage extends Vue {
  get refundList() {
    return refundManage.refundList;
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
      title: '电话',
      key: 'phone'
    },
    {
      title: '退款金额',
      key: 'money'
    },
    {
      title: '日期',
      key: 'date'
    },
    {
      title: '退款状态',
      key: 'status'
    },
    {
      title: '操作',
      slot: 'action'
    }
  ];

  displayData: {
    index: number;
    reId: number;
    userId: number;
    phone: string;
    name: string;
    date: string;
    money: number;
    orderId: number;
    preservationId: number;
    status: string;
    isResolved: boolean;
  }[] = [];

  filteredData: {
    index: number;
    reId: number;
    userId: number;
    phone: string;
    name: string;
    date: string;
    money: number;
    orderId: number;
    preservationId: number;
    status: string;
    isResolved: boolean;
  }[] = [];

  deleteModal: any = {
    isShow: false,
    id: -1,
    title: '',
    userName: '',
    phone: '',
    date: '',
    money: 0,
    msg: '',
  };

  addToBlackListModal: any = {
    isShow: false,
    message: ''
  };

  resolveStatus: string = '同意';

  rejectStatus: string = '拒绝';

  pendingStatus: string = '未处理';

  searchValue: string = '';

  deleteUserId: number = -1;

  addToBlackUserId: number = -1;

  addToBlackPhone: string = '';

  page: number = 1;

  deleteReId: number = -1;

  refundManage: any = {
    isShow: false,
    id: -1,
    title: '',
    userName: '',
    phone: '',
    date: '',
    money: 0,
    msg: '',
    operation: ''
  };

  searchDate: string = '';

  pageIsLoading: boolean = false;

  searchUser(value: string) {
    this.searchValue = value;
    this.changeFilteredData();
  }

  addToBlackList() {

  }

  changeDate(time: string, type: string) {
    this.searchDate = time;
    this.getUserList();
  }

  resolveRefund(index: number) {
    let item = this.displayData[index];
    this.refundManage = {
      isShow: true,
      title: '同意退款',
      id: item.reId,
      userName: item.name,
      phone: item.phone,
      date: item.date,
      money: item.money,
      msg: '确定同意该用户的本次退款记录吗？',
      operation: this.resolveStatus
    };
  }

  rejectRefund(index: number) {
    let item = this.displayData[index];
    this.refundManage = {
      isShow: true,
      title: '拒绝退款',
      id: item.reId,
      userName: item.name,
      phone: item.phone,
      date: item.date,
      money: item.money,
      msg: '确定拒绝该用户的本次退款记录吗？',
      operation: this.rejectStatus
    };
  }

  confirmDeleteUser(index: number) {
    let item = this.displayData[index];
    this.deleteModal = {
      isShow: true,
      title: '删除退款记录',
      id: item.reId,
      userName: item.name,
      phone: item.phone,
      date: item.date,
      money: item.money,
      msg: '确定删除该用户的本次退款记录吗？',
    }
  }

  deleteHandler() {
    if (this.deleteReId == -1) {
      return ;
    }
    refundManage.deleteRefund({
      reId: this.deleteReId
    }).then(res => {
      if (res.isSuccess) {
        operationSuccessMsg('删除退款记录成功');
        this.getUserList();
      } else {
        operationFailMsg('删除退款记录失败');
        operationFailMsg(res.msg);
      }
    });
  }

  getUserList() {
    this.pageIsLoading = true;
    refundManage.getRefundList({
      date: this.searchDate
    }).then(res => {
      this.pageIsLoading = false;
      if (res.isSuccess) {
        this.changeFilteredData();
      } else {
        operationFailMsg('获取数据失败');
      }
    });
  }

  updateRefund() {
    if (this.refundManage.id == -1) {
      return ;
    }
    refundManage.resolve({
      reId: this.refundManage.id,
      status: this.refundManage.operation
    }).then(res => {
      if (res.isSuccess) {
        operationSuccessMsg('退款修改成功');
        this.getUserList();
      } else {
        operationFailMsg('操作失败');
        operationFailMsg(res.msg);
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
    for (let i = 0; i < this.refundList.length; i++) {
      let item = this.refundList[i];
      if (item.name.indexOf(this.searchValue) != -1
        || item.phone.indexOf(this.searchValue) != -1
        || this.searchValue.length == 0) {
        this.filteredData.push({
          index: count++,
          userId: item.userId,
          reId: item.reId,
          date: item.date,
          preservationId: item.preservationId,
          status: item.status,
          phone: item.phone,
          name: item.name,
          money: item.money,
          orderId: item.orderId,
          isResolved: item.status == this.rejectStatus || item.status == this.resolveStatus
        });
      }
    }
    this.changeDisplayData();
  }

  beforeMount() {
    let screenWidth: number = window.screen.availWidth;
    let tableWidthList: number[] = [107, 240, 250, 250, 250, 250, 250];  // 总的1600
    for (let i = 0; i < this.columns.length; i++) {
      this.columns[i].width = tableWidthList[i] * (screenWidth / 1920);
    }
  }

  created() {
    this.getUserList();
  }
}
</script>
