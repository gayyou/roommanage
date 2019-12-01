<style lang="scss" scoped>
@import "scss/mixin";

.shop-manage-container {
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
  <div class="shop-manage-container">
    <custom-header
      name="套餐订单"
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
      style="margin-top: .4rem"
      @on-change="changePage"
    />
    <Modal
      v-model="deleteModal.isShow"
      title="删除操作"
      @on-ok="deleteHandler"
    >
      <p>确定删除订单：<span style="color:rgba(65,140,95,1);font-weight: bold">{{ deleteModal.message }}</span>吗？</p>
    </Modal>
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
  components: {WordButton, CustomTable, CustomHeader}
})
export default class PackageOrder extends Vue {
  get packageOrderList() {
    return orderManage.packageList;
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
    orderId: number;
    money: number;
    date: string;
    userId: number;
    type: string;
    status: string;
    userName: string;
    phone: string;
  }[] = [];

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
    message: ''
  };

  searchValue: string = '';

  deleteOrderId: number = -1;

  page: number = 1;

  searchDate: string = '';

  searchOrder(value: string) {
    this.searchValue = value;
    this.changeFilteredData();
  }

  changeDate(time: string, type: string) {
    this.searchDate = time;
    this.getOrderList();
  }

  confirmDeleteShop(index: number) {
    this.deleteModal.message = this.displayData[index].userName
      + ', 手机号: ' + this.displayData[index].phone + ',日期: ' + this.displayData[index].date;
    this.deleteModal.isShow = true;
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
      let item = this.filteredData[i];
      this.displayData.push(item);
    }
  }

  changeFilteredData() {
    this.filteredData = [];
    let count = 1;
    for (let i = 0; i < this.packageOrderList.length; i++) {
      let item = this.packageOrderList[i];
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
    this.searchValue = '';
    orderManage.getPackageList({
      orderDate: this.searchDate
    }).then(res => {
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
