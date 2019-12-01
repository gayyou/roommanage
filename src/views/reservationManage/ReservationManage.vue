<style lang="scss" scoped>
.reservation-manage-container {
  position: relative;
  width: 100%;
  padding: 0px 20px 20px 20px;
  border-radius: 8px;
  min-height: 90vh;


}
</style>

<template>
  <div class="reservation-manage-container">
    <custom-header
      name="预约情况"
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
      <p>确定删除预约：<span style="color:rgba(65,140,95,1);font-weight: bold">{{ deleteModal.message }}</span>吗？</p>
    </Modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import CustomHeader from "@/components/customHeader/CustomHeader.vue";
import WordButton from "@/components/wordButton/WordButton.vue";
import {reservationManage} from "@/store/modules/ReservationManage";
import { Watch } from 'vue-property-decorator';
import CustomTable from "@/components/customTable/CustomTable.vue";
import {operationFailMsg, operationSuccessMsg} from "@/utils/shared/message";
@Component({
  components: {CustomTable, WordButton, CustomHeader}
})
export default class ReservationManage extends Vue {
  get reservationList() {
    return reservationManage.reservationList;
  }

  columns: any[] = [
    {
      title: '序号',
      key: 'index'
    },
    {
      title: '预约门店',
      key: 'storeName'
    },
    {
      title: '房间类型',
      key: 'roomType'
    },
    {
      title: '预约日期',
      key: 'date'
    },
    {
      title: '预约人',
      key: 'name'
    },
    {
      title: '电话',
      key: 'phone'
    },
    {
      title: '操作',
      slot: 'action'
    }
  ];

  displayData: {
    preservationId: number;
    sitId: number;
    roomId: number;
    index: number;
    storeName: string;
    date: string;
    name: string;
    phone: string;
    roomType: string;
  }[] = [

  ];

  filteredData: {
    preservationId: number;
    sitId: number;
    roomId: number;
    index: number;
    storeName: string;
    date: string;
    name: string;
    phone: string;
    roomType: string;
  }[] = [

  ];

  deleteModal: any = {
    isShow: false,
    message: ''
  };

  searchValue: string = '';

  searchDate: string = '';

  deletePid: number = -1;

  page: number = 1;

  changeDate(time: string, type: string) {
    this.searchDate = time;
    this.getReservationList();
  }

  searchOrder(value: string) {
    this.searchValue = value;
    this.changeFilteredData();
  }

  confirmDeleteShop(index: number) {
    this.deleteModal.message = '用户名: ' + this.displayData[index].name + ', 门店名: ' + this.displayData[index].storeName
                              + ', 消费日期: ' + this.displayData[index].date;
    this.deleteModal.isShow = true;
    this.deletePid = this.displayData[index].preservationId;
  }

  deleteHandler() {
    if (this.deletePid == -1) {
      return ;
    }
    reservationManage.deleteReservation({
      pid: this.deletePid
    }).then(res => {
      if (res.isSuccess) {
        operationSuccessMsg('删除预约记录成功!')
        this.getReservationList();
      } else {
        operationFailMsg('删除预约记录失败');
      }
    })
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
    for (let i = 0; i < this.reservationList.length; i++) {
      let item = this.reservationList[i];
      if (item.name.indexOf(this.searchValue) != -1
        || item.phone.indexOf(this.searchValue) != -1
        || this.searchValue.length == 0) {
        this.filteredData.push({
          index: count++,
          preservationId: item.preservationId,
          sitId: item.sitId,
          roomId: item.roomId,
          storeName: item.storeName,
          date: item.date,
          name: item.name,
          phone: item.phone,
          roomType: item.roomType
        });
      }
    }
    this.changeDisplayData();
  }

  getReservationList() {
    reservationManage.getReservationList({
      date: this.searchDate
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
    let tableWidthList: number[] = [150, 300, 250, 250, 250, 248, 150];  // 总的1600
    for (let i = 0; i < this.columns.length; i++) {
      this.columns[i].width = tableWidthList[i] * (screenWidth / 1920);
    }
    this.getReservationList();
  }
}
</script>
