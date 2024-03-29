<style lang="scss" scoped>
@import "scss/mixin";
@import "scss/shared";

.shop-manage-container {
  position: relative;
  width: 100%;
  padding: 0px 20px 100px;
  border-radius: 8px;
  min-height: 95vh;

  .operate-container {
    @include vertical-center;
    position: relative;
  }
}
</style>

<template>
  <div class="shop-manage-container">
    <custom-header
      name="充值订单"
      :no-create="true"
      @on-search="searchOrder"
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
            type="delete"
            style="margin-left: .2rem"
            @click="confirmDeleteShop(index)"
          >删除</word-button>
        </div>
      </template>
    </custom-table>
    <Page
      :total="filteredData.length"
      :current="page"
      class="turn-page-container"
      @on-change="changePage"
    />
    <Modal
      v-model="deleteModal.isShow"
      title="删除操作"
      @on-ok="deleteHandler"
    >
      <p>确定删除订单：</p>
      <p>用户名：<span style="color:rgba(65,140,95,1);font-weight: bold">{{ deleteModal.name }}</span></p>
      <p>电话：<span style="color:rgba(65,140,95,1);font-weight: bold">{{ deleteModal.phone }}</span></p>
      <p>日期：<span style="color:rgba(65,140,95,1);font-weight: bold">{{ deleteModal.date }}</span></p>
      <p>金额：<span style="color:rgba(65,140,95,1);font-weight: bold">{{ deleteModal.money }}</span></p>
      <p>订单状态：<span style="color:rgba(65,140,95,1);font-weight: bold">{{ deleteModal.status }}</span></p>
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
import {shopManage} from "@/store/modules/ShopManage";
import {Watch} from "vue-property-decorator";
import {shopRequest} from "@/api/ShopRequest";
import {orderManage} from "@/store/modules/OrderManage";
import {operationFailMsg, operationSuccessMsg} from "@/utils/shared/message";
@Component({
  components: {WordButton, CustomTable, CustomHeader},
  name: 'RechargeOrder'
})
export default class RechargeOrder extends Vue {
  get rechargeOrderList() {
    return orderManage.rechargeList;
  }

  columns: any[] = [
    {
      title: '序号',
      key: 'index'
    },
    {
      title: '订单时间',
      key: 'date'
    },
    {
      title: '用户名',
      key: 'userName'
    },
    {
      title: '手机号',
      key: 'phone'
    },
    {
      title: '订单金额',
      key: 'money'
    },
    {
      title: '订单状态',
      key: 'status'
    },
    {
      title: '操作',
      slot: 'action'
    }
  ];

  displayData: {
    index: number;
    userName: string;
    phone: string;
    status: string;
    money: number;
    date: string;
    orderId: number;
  }[] = [

  ];

  filteredData: {
    index: number;
    orderId: number;
    money: number;
    date: string;
    userId: number;
    type: string;
    status: string;
    userName: string;
    phone: string;
  }[] = [

  ];

  deleteModal: any = {
    isShow: false,
    message: '',
    name: '',
    date: '',
    phone: '',
    money: 0,
    status: ''
  };

  searchValue: string = '';

  deleteOrderId: number = -1;

  page: number = 1;

  searchDate: string = '';

  pageIsLoading: boolean = false;

  searchOrder(value: string) {
    this.page = 1;
    this.searchValue = value;
    this.changeFilteredData();
  }

  changeDate(time: string, type: string) {
    this.searchDate = time;
    this.getOrderList();
  }

  confirmDeleteShop(index: number) {
    let item = this.displayData[index];
    this.deleteModal = {
      isShow: true,
      phone: item.phone,
      date: item.date,
      money: item.money,
      name: item.userName,
      status: item.status
    };
    this.deleteOrderId = this.displayData[index].orderId;
  }

  deleteHandler() {
    if (this.deleteOrderId == -1) {
      return ;
    }
    orderManage.deleteOrder({
      orderId: this.deleteOrderId
    }).then(res => {
      if (res.isSuccess) {
        operationSuccessMsg('删除订单成功!');
        this.getOrderList();
      } else {
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
      this.displayData.push({
        orderId: this.filteredData[i].orderId,
        index: this.filteredData[i].index,
        date: this.filteredData[i].date,
        status: this.filteredData[i].status,
        userName: this.filteredData[i].userName,
        phone: this.filteredData[i].phone,
        money: this.filteredData[i].money
      });
    }
  }

  changeFilteredData() {
    this.filteredData = [];
    let count = 1;
    for (let i = 0; i < this.rechargeOrderList.length; i++) {
      let item = this.rechargeOrderList[i];
      if (item.userName.indexOf(this.searchValue) != -1
        || item.phone.indexOf(this.searchValue) != -1
        || this.searchValue.length == 0) {
        this.filteredData.push({
          index: count++,
          orderId: item.orderId,
          date: item.date,
          userId: item.userId,
          status: item.status,
          userName: item.userName,
          phone: item.phone,
          type: item.type,
          money: item.money
        });
      }
    }
    this.changeDisplayData();
  }

  getOrderList() {
    this.pageIsLoading = true;
    this.searchValue = '';
    orderManage.getRechargeOrderList({
      orderDate: this.searchDate,
      orderType: '充值订单'
    }).then(res => {
      this.pageIsLoading = false;
      if (res.isSuccess) {
        this.changeFilteredData();
      } else {
        operationFailMsg(res.msg);
      }
    });
  }

  beforeMount() {
    let screenWidth: number = window.screen.availWidth;
    let tableWidthList: number[] = [150, 250, 250, 250, 295, 250, 150];  // 总的1600
    for (let i = 0; i < this.columns.length; i++) {
      this.columns[i].width = tableWidthList[i] * (screenWidth / 1920);
    }
  }

  created() {
    this.getOrderList();
  }
}
</script>
