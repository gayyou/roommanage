<style lang="scss" scoped>
@import "scss/mixin";
@import "scss/shared";

.study-room-container {
  position: relative;
  width: 100%;
  padding: 0px 20px 20px 20px;
  border-radius: 8px;
  min-height: 90vh;

  .main-container {
    position: relative;
    width: 300px;
    height: 300px;
    margin: 20px auto;

    .module-name {
      font-size:22px;
      font-weight:400;
      line-height:37px;
      color:rgba(0,0,0,1);
    }

    .choice-time-container {
      @include flex-center;
      width: 100%;
      height: 40px;

      .number {
        display: block;
        width: 40px;
        height: 40px;
        text-align: center;
        border-bottom: 1px solid #000;
        font-size:22px;
        font-weight:400;
        line-height:40px;
        color:rgba(0,0,0,1);
      }
    }

    .button-container {
      @include flex-center;
      margin-top: 40px;
      width: 100%;
      height: 48px;
    }
  }
}
</style>

<template>
  <div class="study-room-container">
    <custom-header
      name="自习室管理"
      :no-create="true"
      :no-search="true"
    ></custom-header>
    <div class="main-container">
      <span class="module-name">预约提前开门时间设定</span>
      <div class="choice-time-container">
        <TimePicker format="HH:mm" :value="time" @on-change="changeTime" placeholder="选择提前时间" style="width: 1.7rem;margin-top: .3rem"></TimePicker>
      </div>
      <div class="button-container">
        <Button
          type="primary"
          style="display: block;margin-right: .3rem"
          @click="confirmSave"
        >保存</Button>
        <Button type="error">取消</Button>
      </div>
    </div>
    <Modal
      v-model="saveModal.isShow"
      title="保存操作"
      @on-ok="saveHandler"
    >
      <p>确定修改开门时间为: <span style="color:rgba(65,140,95,1);font-weight: bold">提前{{ saveModal.msg }}分钟</span>吗？</p>
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
import {operationFailMsg, operationSuccessMsg} from "@/utils/shared/message";
import {roomManage} from "@/store/modules/RoomManage";
@Component({
  components: {CustomHeader}
})
export default class StudyRoomManage extends Vue {
  time: string = '';

  minuteCount: number = 0;

  pageIsLoading: boolean = false;

  saveModal: any = {
    isShow: false,
    msg: ''
  };

  changeTime(time: string) {
    this.time = time;
    this.getMinuteNum();
  }

  getMinuteNum() {
    let hour = parseInt(this.time.split(':')[0]);
    let minute = parseInt(this.time.split(':')[1]);
    this.minuteCount = hour * 60 + minute;
  }

  saveHandler() {
    roomManage.setPreTime({
      preTime: this.minuteCount
    }).then(res => {
      if (res.isSuccess) {
        operationSuccessMsg('修改成功');
      } else {
        operationFailMsg(res.msg);
      }
    });
  }

  confirmSave() {
    if (this.time.length == 0) {
      operationFailMsg('请选择时间')
      return ;
    }
    this.saveModal.isShow = true;
    this.saveModal.msg = this.minuteCount;
  }

  beforeMount() {
    this.pageIsLoading = true;
    roomManage.getPreTime().then(res => {
      this.pageIsLoading = false;
      if (res.isSuccess) {
        let nums = parseInt(res.data);
        let minute = nums % 60;
        // @ts-ignore
        let hour = parseInt(nums / 60);
        this.time = (hour < 10 ? '0' + hour : hour)
                    + ':'
                    + (minute < 10 ? '0' + minute : minute);
      } else {
        operationFailMsg('获取提前开门时间失败');
      }
    });
  }
}
</script>
