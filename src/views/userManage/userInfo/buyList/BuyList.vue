<style lang="scss" scoped>
@import "scss/mixin";
.edit-package-container {
  position: relative;
  width:720px;
  height:480px;
  background:rgba(255,255,255,1);
  box-shadow:0px 3px 6px rgba(0,0,0,0.16);
  opacity:1;
  border-radius:8px;
  padding: 0 20px 0 20px;

  .list-container {
    position: relative;
    display: flex;
    overflow: hidden;
    padding-top: 10px;
    padding-bottom: 10px;
    position: relative;
    width: 100%;
    height: 370px;
  }

  .button-container {
    @include flex-center;
    position: relative;
    width: 100%;
    height: 40px;
  }
}
</style>

<template>
  <global-layer>
    <div class="edit-package-container">
      <float-layer-header
        :name="title"
        @on-close="closeLayer"
        @on-search="searchHandler"
      ></float-layer-header>
      <div class="list-container">
        <el-scrollbar>
          <small-custom-table
            :data="displayData"
            :columns="columns"
          ></small-custom-table>
        </el-scrollbar>
      </div>
      <div class="button-container">
        <Button
          type="primary"
          @click="closeLayer"
        >关闭</Button>
      </div>
    </div>
  </global-layer>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import GlobalLayer from "@/components/globalLayer/GlobalLayer.vue";
import FloatLayerHeader from "@/components/floatLayerHeader/FloatLayerHeader.vue";
import {packageManage} from "@/store/modules/PackageManage";
import {Prop} from "vue-property-decorator";
import {operationFailMsg} from "@/utils/shared/message";
import SmallCustomTable from "@/components/smallCustomTable/SmallCustomTable.vue";
import {userListManage} from "@/store/modules/UserListManage";

@Component({
  components: {SmallCustomTable, FloatLayerHeader, GlobalLayer}
})
export default class BuyList extends Vue {
  @Prop(String) userName!: string;

  @Prop(Number) userId!: number;

  title: string = '用户消费记录';

  displayData: {
    id: number;
    userId: number;
    userName: string;
    date: string;
    money: number;
    reason: string;
  }[] = [

  ];

  cacheData: {
    id: number;
    userId: number;
    userName: string;
    date: string;
    money: number;
    reason: string;
  }[] = [];

  columns: any[] = [
    {
      title: '用户名',
      key: 'userName'
    },
    {
      title: '日期',
      key: 'date'
    },
    {
      title: '金额',
      key: 'money'
    },
    {
      title: '消费原因',
      key: 'reason'
    }
  ];

  searchValue: string = '';

  closeLayer() {
    this.$emit('on-close');
  }

  searchHandler(value: string) {
    this.searchValue = value;
    this.filterData();
  }

  filterData() {
    this.displayData = [];
    for (let i = 0; i < this.cacheData.length; i++) {
      let item = this.cacheData[i];
      if (item.userName.indexOf(this.searchValue) != -1
        || item.date.indexOf(this.searchValue) != -1) {
        this.displayData.push(item);
      }
    }
  }

  saveList(list: {
    id: number;
    userId: number;
    changedDate: string;
    money: number;
    reason: string;
  }[]) {
    this.cacheData = [];
    for (let i = 0; i < list.length; i++) {
      let item = list[i];
      this.cacheData.push({
        id: item.id,
        userId: item.userId,
        userName: this.userName,
        money: item.money,
        date: item.changedDate,
        reason: item.reason
      });
    }
    this.filterData();
  }

  created() {
    userListManage.getUsedMoneyList({
      userId: this.userId
    }).then(res => {
      if (res.isSuccess) {
        this.saveList(res.data);
      } else {
        operationFailMsg('获取消费记录失败');
        operationFailMsg(res.msg);
      }
    });
  }

  beforeMount() {
    let screenWidth: number = window.screen.availWidth;
    let tableWidthList: number[] = [140, 180, 150, 198];  // 总的680
    for (let i = 0; i < this.columns.length; i++) {
      this.columns[i].width = tableWidthList[i] * (screenWidth / 1920);
    }
  }
}
</script>
