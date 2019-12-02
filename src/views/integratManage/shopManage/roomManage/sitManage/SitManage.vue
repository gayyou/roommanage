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
      :name="title"
      :no-slot="true"
      @on-search="searchShop"
      @on-add="addSit"
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
            @click="editShop(index)"
          >编辑</word-button>
<!--          <word-button-->
<!--            type="primary"-->
<!--            style="margin-left: .2rem"-->
<!--            @click="editSit(index)"-->
<!--          >座位管理</word-button>-->
          <word-button
            type="delete"
            style="margin-left: .2rem"
            @click="confirmDeleteShop(index)"
          >删除</word-button>
        </div>
      </template>
    </custom-table>
    <edit-sit-layer
      v-if="editSitManage.isShow"
      :room-type="this.roomType"
      :room-id="this.roomId"
      :store-id="this.storeId"
      :money="editSitManage.money"
      :sit-id="editSitManage.sitId"
      @on-close="closeLayer"
      @on-renew="getSitList"
    ></edit-sit-layer>
    <edit-sit-money
      v-if="editSitMoneyManage.isShow"
      :room-type="this.roomType"
      :room-id="this.roomId"
      :store-id="this.storeId"
      :money="editSitMoneyManage.money"
      :sit-id="editSitMoneyManage.sitId"
      @on-close="closeSitMoney"
      @on-renew="getSitList"
    ></edit-sit-money>
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
      <p>确定删除房间号为：<span style="color:rgba(65,140,95,1);font-weight: bold">{{ deleteModal.message }}</span>吗？</p>
    </Modal>
    <Spin size="large" fix v-if="pageIsLoading">
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
import {operationFailMsg, operationSuccessMsg} from "@/utils/shared/message";
import {roomManage} from "@/store/modules/RoomManage";
import {sitManage} from "@/store/modules/SitManage";
import EditSitLayer from "@/views/integratManage/shopManage/roomManage/sitManage/editSitLayer/EditSitLayer.vue";
import EditSitMoney from "@/views/integratManage/shopManage/roomManage/sitManage/editSitMoney/EditSitMoney.vue";
@Component({
  components: {EditSitMoney, EditSitLayer, WordButton, CustomTable, CustomHeader}
})
export default class SitManage extends Vue {
  get sitList() {
    return sitManage.sitList;
  }

  storeId: number = -1;

  roomId: string = '';

  roomType: string = '';

  pageIsLoading: boolean = false;

  columns: any[] = [
    {
      title: '序号',
      key: 'index'
    },
    {
      title: '座位编号',
      key: 'sitId'
    },
    {
      title: '金额',
      key: 'money'
    },
    {
      title: '房间号',
      key: 'roomId'
    },
    {
      title: '房间类型',
      key: 'roomType'
    },
    {
      title: '门店名',
      key: 'storeName'
    },
    {
      title: '操作',
      slot: 'action'
    }
  ];

  displayData: {
    index: number;
    storeName: string;
    sitId: number;
    roomId: string;
    roomType: string;
    storeId: number;
    money: number
  }[] = [];

  filteredData: {
    index: number;
    sitId: number;
    storeName: string;
    roomId: string;
    roomType: string;
    storeId: number;
    money: number
  }[] = [];

  deleteModal: any = {
    isShow: false,
    message: ''
  };

  editSitManage: any = {
    isShow: false,
    money: -1,
    sitId: -1
  };

  editSitMoneyManage: any = {
    isShow: false,
    money: -1,
    sitId: -1
  };

  searchValue: string = '';

  deleteShopId: number = -1;

  deleteRoomType: string = '';

  deleteRoomId: string = '';

  deleteStoreId: number = -1;

  storeName: string = '';

  title: string = '座位管理';

  page: number = 1;

  editShop(index: number) {
    // 编辑店铺的按钮
    this.editSitMoneyManage.money = this.displayData[index].money;
    this.editSitMoneyManage.sitId = this.displayData[index].sitId;
    this.editSitMoneyManage.isShow = true;
  }

  addSit() {
    this.editSitManage.sitId = -1;
    this.editSitManage.money = 0;
    this.editSitManage.isShow = true;
  }

  closeLayer() {
    this.editSitManage.isShow = false;
  }

  closeSitMoney() {
    this.editSitMoneyManage.isShow = false;
  }

  searchShop(value: string) {
    this.searchValue = value;
    this.changeFilteredData();
  }

  confirmDeleteShop(index: number) {
    this.deleteModal.message = this.displayData[index].sitId;
    this.deleteModal.isShow = true;
    this.deleteShopId = this.displayData[index].sitId;
    this.deleteStoreId = this.displayData[index].storeId;
    this.deleteRoomType = this.displayData[index].roomType;
    this.deleteRoomId = this.displayData[index].roomId;
  }

  deleteHandler() {
    if (this.deleteShopId == -1) {
      return ;
    }
    sitManage.removeSit({
      storeId: this.storeId,
      roomId: this.roomId,
      sitId: this.deleteShopId,
      roomType: this.roomType
    }).then(res => {
      if (res.isSuccess) {
        operationSuccessMsg('删除座位成功');
        this.getSitList();
      } else {
        operationFailMsg('删除座位失败');
        operationFailMsg(res.msg);
      }
    });
  }

  getSitList() {
    this.pageIsLoading = true;
    sitManage.getSitList({
      storeId: this.storeId,
      roomType: this.roomType,
      roomId: this.roomId
    }).then(res => {
      this.pageIsLoading = false;
      if (res.isSuccess) {
        this.changeFilteredData();
      } else {
        operationFailMsg('获取房间列表失败');
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
    for (let i = 0; i < this.sitList.length; i++) {
      let item = this.sitList[i];
      if (item.roomType.indexOf(this.searchValue) != -1
        || item.roomId.indexOf(this.searchValue) != -1
        || this.searchValue.length == 0) {
        this.filteredData.push({
          index: count++,
          storeId: item.storeId,
          roomId: item.roomId,
          sitId: item.sitId,
          roomType: item.roomType,
          storeName: this.storeName,
          money: item.money
        });
      }
    }
    this.changeDisplayData();
  }

  getStoreInfo() {
    shopManage.getStoreInfo({
      storeId: this.storeId
    }).then(res => {
      if (res.isSuccess) {
        this.title += '-' + res.data.storeName + '-' + this.roomType + '-' + this.roomId;
        this.storeName = res.data.storeName;
        this.getSitList();
      } else {
        operationFailMsg('获取门店信息失败，跳回门店管理页面');
        this.$router.push({
          name: '门店管理'
        });
      }
    });
  }

  beforeMount() {
    // let screenWidth: number = window.screen.availWidth;
    // let tableWidthList: number[] = [157, 303, 709, 160, 270];  // 总的1600
    // for (let i = 0; i < this.columns.length; i++) {
    //   this.columns[i].width = tableWidthList[i] * (screenWidth / 1920);
    // }
  }

  created() {
    let param = this.$route.params;
    this.storeId = parseInt(param.storeId) || -1;
    this.roomId = param.roomId || '-1';
    this.roomType = param.roomType || '';
    if (this.storeId == -1 || this.roomId == '-1' || this.roomType.length == 0) {
      this.$router.push({
        name: '门店管理'
      });
    }
    this.getStoreInfo();
  }
}
</script>
