<style lang="scss" scoped>
@import "scss/mixin";
@import "scss/shared";

.shop-manage-container {
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
  <div class="shop-manage-container">
    <custom-header
      name="门店管理"
      :no-slot="true"
      @on-search="searchShop"
      @on-add="addShop"
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
            @click="editRoom(index)"
          >房间管理</word-button>
          <word-button
            type="delete"
            style="margin-left: .2rem"
            @click="confirmDeleteShop(index)"
          >删除</word-button>
        </div>
      </template>
    </custom-table>
    <Page
      class="turn-page-container"
      :total="filteredData.length"
      @on-change="changePage"
    />
    <Modal
      v-model="deleteModal.isShow"
      title="删除操作"
      @on-ok="deleteHandler"
    >
      <p>确定删除店铺：<span style="color:rgba(65,140,95,1);font-weight: bold">{{ deleteModal.message }}</span>吗？</p>
    </Modal>
    <edit-store-layer
      v-if="isShowEditStore"
      :name="editInfo.name"
      :intro="editInfo.intro"
      :id="editInfo.id"
      :status="editInfo.status"
      @on-close="closeLayer"
      @on-renew="getShopList"
    ></edit-store-layer>
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
import {operationFailMsg, operationSuccessMsg} from "@/utils/shared/message";
import EditStoreLayer from "@/views/integratManage/shopManage/editStoreLayer/EditStoreLayer.vue";
@Component({
  components: {EditStoreLayer, WordButton, CustomTable, CustomHeader}
})
export default class ShopManage extends Vue {
  get allShopList() {
    return shopManage.shopList;
  }

  columns: any[] = [
    {
      title: '序号',
      key: 'index'
    },
    {
      title: '门店名称',
      key: 'name'
    },
    {
      title: '详细信息',
      key: 'message'
    },
    {
      title: '门店状态',
      key: 'status'
    },
    {
      title: '操作',
      slot: 'action'
    }
  ];

  displayData: {
    id: number;
    index: number;
    name: string;
    message: string;
    status: string;
  }[] = [

  ];

  filteredData: {
    index: number;
    name: string;
    id: number;
    address: string;
    status: number;
  }[] = [

  ];

  deleteModal: any = {
    isShow: false,
    message: ''
  };

  searchValue: string = '';

  deleteShopId: number = -1;

  page: number = 1;

  isShowEditStore: boolean = false;

  pageIsLoading: boolean = false;

  editInfo: any = {
    name: '',
    intro: '',
    status: -1,
    id: -1
  };

  closeLayer() {
    this.isShowEditStore = false
  }

  editShop(index: number) {
    // 编辑店铺的按钮
    this.editInfo.status = this.displayData[index].status;
    this.editInfo.name = this.displayData[index].name;
    this.editInfo.intro = this.displayData[index].message;
    this.editInfo.id = this.displayData[index].id;
    this.isShowEditStore = true;
  }

  editRoom(index: number) {
    this.$router.push({
      name: '房间管理',
      params: {
        storeId: (this.displayData[index].id).toString()
      }
    })
  }

  searchShop(value: string) {
    this.searchValue = value;
    this.changeFilteredData();
  }

  addShop() {
    this.editInfo.status = '';
    this.editInfo.name = '';
    this.editInfo.intro = '';
    this.editInfo.id = -1;
    this.isShowEditStore = true;
  }

  confirmDeleteShop(index: number) {
    this.deleteModal.message = this.displayData[index].name;
    this.deleteModal.isShow = true;
    this.deleteShopId = this.displayData[index].id;
  }

  deleteHandler() {
    if (this.deleteShopId == -1) {
      return ;
    }
    shopManage.deleteStore({
      storeId: this.deleteShopId
    }).then(res => {
      if (res.isSuccess) {
        operationSuccessMsg('删除店铺成功');
        this.getShopList();
      } else {
        operationFailMsg('删除店铺失败');
      }
    });
  }

  getShopList() {
    this.pageIsLoading = true;
    shopManage.getShopList().then(res => {
      this.pageIsLoading = false;
      if (res.isSuccess) {
        this.changeFilteredData();
      } else {
        operationFailMsg('获取店铺列表失败');
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
        id: this.filteredData[i].id,
        index: this.filteredData[i].index,
        message: this.filteredData[i].address,
        name: this.filteredData[i].name,
        status: this.filteredData[i].status == 1 ? '营业中' : '停业'
      });
    }
  }

  changeFilteredData() {
    this.filteredData = [];
    let count = 1;
    for (let i = 0; i < this.allShopList.length; i++) {
      if (this.allShopList[i].name.indexOf(this.searchValue) != -1 || this.searchValue.length == 0) {
        this.filteredData.push({
          index: count++,
          id: this.allShopList[i].id,
          address: this.allShopList[i].address,
          status: this.allShopList[i].status,
          name: this.allShopList[i].name,
        });
      }
    }
    this.changeDisplayData();
  }

  beforeMount() {
    let screenWidth: number = window.screen.availWidth;
    let tableWidthList: number[] = [157, 303, 709, 160, 270];  // 总的1600
    for (let i = 0; i < this.columns.length; i++) {
      this.columns[i].width = tableWidthList[i] * (screenWidth / 1920);
    }
  }

  created() {
    this.getShopList();
  }
}
</script>
