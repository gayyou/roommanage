<style lang="scss" scoped>
@import "scss/mixin";
@import "scss/shared";
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
      @on-add="addRoom"
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
          <word-button
            type="primary"
            style="margin-left: .2rem"
            @click="editSit(index)"
          >座位管理</word-button>
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
      <p>确定删除房间号为：<span style="color:rgba(65,140,95,1);font-weight: bold">{{ deleteModal.message }}</span>吗？</p>
    </Modal>
    <edit-room-layer
      v-if="editLayerManage.isShow"
      :store-id="editLayerManage.storeId"
      :room-id="editLayerManage.roomId"
      :room-type="editLayerManage.roomType"
      @on-close="closeEditLayer"
      @on-renew="getRoomList"
    ></edit-room-layer>
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
import EditRoomLayer from "@/views/integratManage/shopManage/roomManage/editRoomLayer/EditRoomLayer.vue";
@Component({
  components: {EditRoomLayer, WordButton, CustomTable, CustomHeader}
})
export default class RoomManage extends Vue {
  get roomList() {
    return roomManage.roomList;
  }

  storeId: number = -1;

  columns: any[] = [
    {
      title: '序号',
      key: 'index'
    },
    {
      title: '房间类型',
      key: 'roomType'
    },
    {
      title: '房间号',
      key: 'roomId'
    },
    {
      title: '操作',
      slot: 'action'
    }
  ];

  displayData: {
    index: number;
    roomId: string;
    roomType: string;
    storeId: number;
  }[] = [

  ];

  filteredData: {
    index: number;
    roomId: string;
    roomType: string;
    storeId: number;
  }[] = [

  ];

  deleteModal: any = {
    isShow: false,
    message: ''
  };

  editLayerManage: any = {
    isShow: false,
    roomType: '',
    roomId: '',
    storeId: -1
  };

  searchValue: string = '';

  deleteShopId: number = -1;

  deleteRoomType: string = '';

  deleteRoomId: string = '';

  page: number = 1;

  pageIsLoading: boolean = false;

  title: string = '房间管理';

  closeEditLayer() {
    this.editLayerManage.isShow = false;
  }

  editShop(index: number) {
    // 编辑店铺的按钮
    let item = this.displayData[index];
    this.editLayerManage.storeId = this.storeId;
    this.editLayerManage.roomType = item.roomType;
    this.editLayerManage.roomId = item.roomId;
    this.editLayerManage.isShow = true;
  }

  addRoom() {
    this.editLayerManage.roomId = '';
    this.editLayerManage.storeId = this.storeId;
    this.editLayerManage.roomType = '';
    this.editLayerManage.isShow = true;
  }

  editSit(index: number) {
    let roomId = this.displayData[index].roomId;
    let roomType = this.displayData[index].roomType;
    this.$router.push({
      name: '座位管理',
      params: {
        storeId: this.storeId.toString(),
        roomId,
        roomType
      }
    })
  }

  searchShop(value: string) {
    this.searchValue = value;
    this.changeFilteredData();
  }

  confirmDeleteShop(index: number) {
    this.deleteModal.message = this.displayData[index].storeId;
    this.deleteModal.isShow = true;
    this.deleteShopId = this.displayData[index].storeId;
    this.deleteRoomType = this.displayData[index].roomType;
    this.deleteRoomId = this.displayData[index].roomId;
  }

  deleteHandler() {
    if (this.deleteShopId == -1) {
      return ;
    }
    roomManage.removeRoom({
      storeId: this.storeId,
      roomType: this.deleteRoomType,
      roomId: this.deleteRoomId
    }).then(res => {
      if (res.isSuccess) {
        operationSuccessMsg('删除房间成功');
        this.getRoomList();
      } else {
        operationFailMsg('删除房间失败');
      }
    });
  }

  getRoomList() {
    this.pageIsLoading = true;
    roomManage.getRoomList({
      storeId: this.storeId
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
    for (let i = 0; i < this.roomList.length; i++) {
      let item = this.roomList[i];
      if (item.roomType.indexOf(this.searchValue) != -1
        || item.roomId.indexOf(this.searchValue) != -1
        || this.searchValue.length == 0) {
        this.filteredData.push({
          index: count++,
          storeId: item.storeId,
          roomType: item.roomType,
          roomId: item.roomId
        });
      }
    }
    this.changeDisplayData();
  }

  beforeMount() {
    // let screenWidth: number = window.screen.availWidth;
    // let tableWidthList: number[] = [157, 303, 709, 160, 270];  // 总的1600
    // for (let i = 0; i < this.columns.length; i++) {
    //   this.columns[i].width = tableWidthList[i] * (screenWidth / 1920);
    // }
  }

  getStoreInfo() {
    shopManage.getStoreInfo({
      storeId: this.storeId
    }).then(res => {
      if (res.isSuccess) {
        this.title += '-' + res.data.storeName;
      } else {
        operationFailMsg('获取门店信息失败，跳回门店管理页面');
        this.$router.push({
          name: '门店管理'
        });
      }
    });
  }

  created() {
    let param = this.$route.params;
    this.storeId = parseInt(param.storeId) || -1;
    if (this.storeId == -1) {
      this.$router.push({
        name: '门店管理'
      });
    }
    this.getStoreInfo();
    this.getRoomList();
  }
}
</script>
