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
        <span class="item-key">房间编号</span>
        <input
          class="item-input"
          v-model="localRoomId"
          @input="limitRoomId"
        />
      </div>
      <div class="item-container">
        <span class="item-key">房间类型</span>
        <input
          class="item-input"
          v-model="localRoomType"
          @input="limitRoomType"
        />
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
        <p>房间编号: <span style="font-weight: bold;color: #418c5f;font-size: .2rem">{{ localRoomId }}</span></p>
        <p>房间类型: <span style="font-weight: bold;color: #418c5f;font-size: .2rem">{{ localRoomType }}</span></p>
      </Modal>
    </div>
  </global-layer>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import GlobalLayer from "@/components/globalLayer/GlobalLayer.vue";
import FloatLayerHeader from "@/components/floatLayerHeader/FloatLayerHeader.vue";
import {Prop} from "vue-property-decorator";
import {limitString} from "@/utils/shared";
import {operationFailMsg, operationSuccessMsg} from '@/utils/shared/message';
import {roomManage} from "@/store/modules/RoomManage";
@Component({
  components: {FloatLayerHeader, GlobalLayer}
})
export default class EditRoomLayer extends Vue {
  @Prop(Number) storeId!: number;

  @Prop(String) roomId!: string;

  @Prop(String) roomType!: string;

  title: string = '编辑门店';

  localRoomId: string = '';

  localRoomType: string = '';

  isCreate: boolean = false;

  isLoading: boolean = false;

  cancelModal: any = {
    isShow: false
  };

  confirmModal: any = {
    isShow: false,
    msg: ''
  };

  limitRoomId() {
    this.localRoomId = limitString(this.localRoomId, 10);
  }

  limitRoomType() {
    this.localRoomType = limitString(this.localRoomType, 25);
  }

  showCancelModal() {
    if (this.localRoomId != this.roomId || this.localRoomType != this.roomType) {
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
    if (this.localRoomId.length == 0) {
      operationFailMsg('请输入房间编号');
      return ;
    }
    if (this.localRoomType.length == 0) {
      operationFailMsg('请输入房间类型');
      return ;
    }
    this.confirmModal.isShow = true;
  }

  confirmHandler() {
    this.isLoading = true;
    if (this.isCreate) {
      roomManage.addRoom({
        roomType: this.localRoomType,
        roomId: this.localRoomId,
        storeId: this.storeId
      }).then(res => {
        this.isLoading = false;
        if (res.isSuccess) {
          operationSuccessMsg('添加房间成功');
          this.renewHandler();
        } else {
          operationFailMsg(res.msg);
        }
      });
    } else {
      roomManage.removeRoom({
        storeId: this.storeId,
        roomType: this.roomType,
        roomId: this.roomId
      }).then(res => {
        if (res.isSuccess) {
          roomManage.addRoom({
            storeId: this.storeId,
            roomType: this.localRoomType,
            roomId: this.localRoomId
          }).then(res => {
            this.isLoading = false;
            if (res.isSuccess) {
              operationSuccessMsg('更新门店成功');
              this.renewHandler();
            } else {
              operationFailMsg(res.msg);
            }
          });
        } else {
          this.isLoading = false;
          operationFailMsg('更新房间错误')
          operationFailMsg(res.msg);
        }
      });
    }
  }

  beforeMount() {
    if (this.roomId.length == 0) {
      this.title = '创建门店';
      this.isCreate = true;
    }
    this.localRoomId = this.roomId;
    this.localRoomType = this.roomType;
  }
}
</script>
