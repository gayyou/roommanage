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
      name="套餐管理"
      :no-slot="true"
      @on-search="searchPackage"
      @on-add="addPackage"
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
            type="green"
            @click="packageBuyInfo(index)"
          >购买情况</word-button>
          <word-button
            type="primary"
            style="margin-left: .2rem"
            @click="editPackage(index)"
          >编辑</word-button>
          <word-button
            type="delete"
            style="margin-left: .2rem"
            @click="confirmDeletePackage(index)"
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
      <p>确定删除套餐：</p>
      <p>套餐名：<span style="color:rgba(65,140,95,1);font-weight: bold">{{ deleteModal.name }}</span></p>
      <p>套餐类型：<span style="color:rgba(65,140,95,1);font-weight: bold">{{ deleteModal.type }}</span></p>
      <p>套餐详情：<span style="color:rgba(65,140,95,1);font-weight: bold">{{ deleteModal.detail }}</span></p>
      <p>套餐金额：<span style="color:rgba(65,140,95,1);font-weight: bold">{{ deleteModal.money }}</span></p>
      <p>套餐天数：<span style="color:rgba(65,140,95,1);font-weight: bold">{{ deleteModal.days }}</span></p>
    </Modal>
    <edit-package
      v-if="editPackageManage.isShow"
      :money="editPackageManage.money"
      :name="editPackageManage.name"
      :type="editPackageManage.type"
      :detail="editPackageManage.detail"
      :days="editPackageManage.days"
      :id="editPackageManage.id"
      @on-close="closeEditPackageLayer"
      @on-renew="getShopList"
    ></edit-package>
    <consumption-list
      v-if="consumptionListManage.isShow"
      :meal-id="consumptionListManage.mealId"
      @on-close="closeConsumptionList"
    ></consumption-list>
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
import EditPackage from "@/views/packageManage/editPackage/EditPackage.vue";
import ConsumptionList from "@/views/packageManage/consumptionList/ConsumptionList.vue";
@Component({
  components: {ConsumptionList, EditPackage, WordButton, CustomTable, CustomHeader},
  name: 'PackageManage'
})
export default class PackageManage extends Vue {
  get packageList() {
    return packageManage.packageList;
  }

  columns: any[] = [
    {
      title: '序号',
      key: 'index'
    },
    {
      title: '套餐名称',
      key: 'name'
    },
    {
      title: '套餐类型',
      key: 'type'
    },
    {
      title: '套餐金额',
      key: 'money'
    },
    {
      title: '套餐日期',
      key: 'days'
    },
    {
      title: '套餐介绍',
      key: 'detail'
    },
    {
      title: '操作',
      slot: 'action'
    }
  ];

  displayData: {
    index: number;
    id: number;
    money: number;
    type: string;
    detail: string;
    days: number;
    name: string;
  }[] = [

  ];

  filteredData: {
    index: number;
    id: number;
    money: number;
    type: string;
    detail: string;
    days: number;
    name: string;
  }[] = [

  ];

  deleteModal: any = {
    isShow: false,
    name: '',
    type: '',
    money: 0,
    detail: '',
    days: 0
  };

  searchValue: string = '';

  deletePackageId: number = -1;

  page: number = 1;

  pageIsLoading: boolean = false;

  consumptionListManage: any = {
    isShow: false,
    mealId: -1
  };

  editPackageManage: any = {
    isShow: false,
    id: -1,
    type: '',
    name: '',
    detail: '',
    money: 0,
    days: 0
  };

  closeConsumptionList() {
    this.consumptionListManage.isShow = false;
  }

  closeEditPackageLayer() {
    this.editPackageManage.isShow = false;
  }

  searchPackage(value: string) {
    this.searchValue = value;
    this.changeFilteredData();
  }

  packageBuyInfo(index: number) {
    this.consumptionListManage.mealId = this.displayData[index].id;
    this.consumptionListManage.isShow = true;
  }

  editPackage(index: number) {
    this.editPackageManage.id = this.displayData[index].id;
    this.editPackageManage.days = this.displayData[index].days;
    this.editPackageManage.detail = this.displayData[index].detail;
    this.editPackageManage.type = this.displayData[index].type;
    this.editPackageManage.money = this.displayData[index].money;
    this.editPackageManage.name = this.displayData[index].name;
    this.editPackageManage.isShow = true;
  }

  addPackage() {
    this.editPackageManage.id = -1;
    this.editPackageManage.days = 0;
    this.editPackageManage.detail = '';
    this.editPackageManage.type = '';
    this.editPackageManage.money = 0;
    this.editPackageManage.name = '';
    this.editPackageManage.isShow = true;
  }

  confirmDeletePackage(index: number) {
    let item = this.displayData[index];
    this.deleteModal = {
      isShow: true,
      name: item.name,
      type: item.type,
      money: item.money,
      detail: item.detail,
      days: item.days
    };
    this.deletePackageId = this.displayData[index].id;
  }

  deleteHandler() {
    if (this.deletePackageId == -1) {
      return ;
    }
    packageManage.deletePackage({
      mealId: this.deletePackageId
    }).then(res => {
      if (res.isSuccess) {
        operationSuccessMsg('删除套餐成功');
        this.getShopList();
      } else {
        operationFailMsg('删除套餐失败');
      }
    });
  }

  getShopList() {
    this.pageIsLoading = true;
    packageManage.getPackageList().then(res => {
      this.pageIsLoading = false;
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
    for (let i = 0; i < this.packageList.length; i++) {
      let item = this.packageList[i]
      if (item.name.indexOf(this.searchValue) != -1 || this.searchValue.length == 0) {
        this.filteredData.push({
          index: count++,
          id: item.id,
          days: item.days,
          detail: item.detail,
          type: item.type,
          name: item.name,
          money: item.money
        });
      }
    }
    this.changeDisplayData();
  }

  beforeMount() {
    let screenWidth: number = window.screen.availWidth;
    let tableWidthList: number[] = [107, 200, 200, 200, 200, 430, 250];  // 总的1600
    for (let i = 0; i < this.columns.length; i++) {
      this.columns[i].width = tableWidthList[i] * (screenWidth / 1920);
    }
  }

  created() {
    this.getShopList();
  }
}
</script>
