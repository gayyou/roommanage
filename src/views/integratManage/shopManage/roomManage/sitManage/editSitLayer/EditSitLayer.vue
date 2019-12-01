<style lang="scss" scoped>
@import "scss/shared";
@import "scss/mixin";
.edit-room-layer {
  position: relative;
  width:720px;
  height:260px;
  background:rgba(255,255,255,1);
  box-shadow:0px 3px 6px rgba(0,0,0,0.16);
  opacity:1;
  border-radius:8px;
  padding: 0 20px 0 20px;

  .item-container {
    @include clear-float;
    display: flex;
    margin-top: 20px;
    width: 100%;


    .item-input {
      width:560px;
      height:36px;
      background:rgba(255,255,255,1);
      border:1px solid rgba(198,198,198,1);
      opacity:1;
      border-radius:4px;
      margin-left: 20px;
      padding-left: 5px;
      padding-right: 5px;
    }

    .text-area {
      width:560px;
      height:160px;
      background:rgba(255,255,255,1);
      border:1px solid rgba(198,198,198,1);
      opacity:1;
      border-radius:4px;
      margin-left: 20px;
      resize: none;
      padding: 5px;
    }
  }

  .button-container {
    @include flex-center;
    position: relative;
    height: 48px;
    margin-top: 20px;
  }
}
</style>

<template>
  <global-layer>
    <div class="edit-room-layer">
      <float-layer-header
        :no-search="true"
        :name="title"
        @on-close="showCancelModal"
      ></float-layer-header>
      <div class="item-container">
        <span class="item-key">座位编号</span>
        <input
          class="item-input"
          v-model="displaySitId"
          @input="limitDisplaySitId"
        />
      </div>
      <div class="item-container">
        <span class="item-key">座位单价</span>
        <InputNumber :max="100" :min="0.01" v-model="localMoney" style="margin-left: 0.2rem"></InputNumber>
      </div>
      <div class="button-container">
        <Button
          @click="showCancelModal"
        >取消</Button>
        <Button
          type="primary"
          style="margin-left: .4rem"
          @click="showConfirmModal"
          :loading="isLoading"
        >确定</Button>
      </div>
      <Modal
        v-model="cancelModal.isShow"
        title="取消操作"
        @on-ok="cancelHander"
      >
        <p>系统不会保存您的修改，确定退出吗？</p>
      </Modal>
      <Modal
        v-model="confirmModal.isShow"
        title="保存操作"
        @on-ok="confirmHandler"
      >
        <p v-if="isCreate">确定添加房间: </p>
        <p v-else>确定将房间修改为: </p>
        <p>座位编号: <span style="font-weight: bold;color: #418c5f;font-size: .2rem">{{ localSitId }}</span></p>
        <p>座位单价: <span style="font-weight: bold;color: #418c5f;font-size: .2rem">{{ localMoney }}</span></p>
      </Modal>
    </div>
  </global-layer>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import GlobalLayer from "@/components/globalLayer/GlobalLayer.vue";
import FloatLayerHeader from "@/components/floatLayerHeader/FloatLayerHeader.vue";
import {Prop, Watch} from "vue-property-decorator";
import {limitString} from "@/utils/shared";
import {operationFailMsg, operationSuccessMsg} from '@/utils/shared/message';
import {roomManage} from "@/store/modules/RoomManage";
import {sitManage} from "@/store/modules/SitManage";
@Component({
  components: {FloatLayerHeader, GlobalLayer}
})
export default class EditSitLayer extends Vue {
  @Prop(Number) storeId!: number;

  @Prop(String) roomId!: string;

  @Prop(String) roomType!: string;

  @Prop(Number) sitId!: number;

  @Prop(Number) money!: number;

  title: string = '编辑座位';

  localMoney: number = 0;

  localSitId: number = 0;

  displaySitId: string = '';

  isCreate: boolean = false;

  isLoading: boolean = false;

  cancelModal: any = {
    isShow: false
  };

  confirmModal: any = {
    isShow: false,
    msg: ''
  };

  @Watch('displaySitId')
  handler(newValue: string) {
    this.localSitId = parseInt(newValue);
  }

  limitDisplaySitId() {
    this.displaySitId = limitString(this.displaySitId, 10);
  }

  showCancelModal() {
    if (this.localSitId != this.sitId || this.localMoney != this.money) {
      this.cancelModal.isShow = true;
    } else {
      this.cancelHander();
    }
  }

  cancelHander() {
    this.$emit('on-close');
  }

  renewHandler() {
    this.$emit('on-renew');
    this.cancelHander();
  }

  showConfirmModal() {
    if (this.isLoading) {
      operationFailMsg('请耐心等待后台响应后再点击');
      return ;
    }
    if (this.displaySitId.length == 0) {
      operationFailMsg('请输入座位编号');
      return ;
    }
    if (!/^[0-9]*$/.test(this.displaySitId)) {
      operationFailMsg('请输入数字');
      return ;
    }
    this.confirmModal.isShow = true;
  }

  confirmHandler() {
    this.isLoading = true;
    if (this.isCreate) {
      sitManage.addSit({
        roomId: this.roomId,
        storeId: this.storeId,
        sitId: parseInt(this.displaySitId),
        roomType: this.roomType,
        money: this.localMoney
      }).then(res => {
        if (res.isSuccess) {
          operationSuccessMsg('创建座位成功');
          this.renewHandler();
        } else {
          operationFailMsg(res.msg);
        }
      });
    } else {
      sitManage.updateSit({
        roomId: this.roomId,
        storeId: this.storeId,
        sitId: parseInt(this.displaySitId),
        roomType: this.roomType,
        money: this.localMoney
      }).then(res => {
        if (res.isSuccess) {
          operationSuccessMsg('修改座位成功');
          this.renewHandler();
        } else {
          operationFailMsg(res.msg);
        }
      });
    }
  }

  beforeMount() {
    if (this.sitId == -1) {
      this.title = '创建座位';
      this.isCreate = true;
    } else {
      this.displaySitId = this.localSitId.toString();
    }
    this.localMoney = this.money == -1 ? 0.01 : this.money;
    this.localSitId = this.sitId;
  }
}
</script>
