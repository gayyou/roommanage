<style lang="scss" scoped>
@import "scss/shared";
@import "scss/mixin";
.edit-store-layer-container {
  position: relative;
  width:720px;
  background:rgba(255,255,255,1);
  box-shadow:0px 3px 6px rgba(0,0,0,0.16);
  opacity:1;
  border-radius:8px;
  padding: 0 20px 20px 20px;

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
    <div class="edit-store-layer-container">
      <float-layer-header :name="title"
        @on-close="showCancelModal"
        :no-search="true"
      ></float-layer-header>
      <div class="item-container">
        <span class="item-key">门店名称</span>
        <input
          class="item-input"
          v-model="localName"
          @input="limitName"
        />
      </div>
      <div class="item-container">
        <span class="item-key">详细信息</span>
        <textarea
          class="text-area"
          v-model="localIntro"
          @input="limitIntro"
        ></textarea>
      </div>
      <div class="item-container" v-if="!isCreate">
        <span class="item-key">营业状态</span>
        <RadioGroup v-model="storeStatus" style="margin-left: .2rem">
          <Radio :label="isOpenStatus"></Radio>
          <Radio :label="isCloseStaus" style="margin-left: .2rem"></Radio>
        </RadioGroup>
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
        <p v-if="isCreate">确定增加门店: </p>
        <p v-else>确定将门店修改为: </p>
        <p>门店名: <span style="font-weight: bold;color: #418c5f;font-size: .2rem">{{ localName }}</span></p>
        <p>门店详情: <span style="font-weight: bold;color: #418c5f;font-size: .2rem">{{ localIntro }}</span></p>
        <p v-if="!isCreate">门店状态: <span style="font-weight: bold;color: #418c5f;font-size: .2rem">{{ storeStatus }}</span></p>
      </Modal>
    </div>
  </global-layer>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import GlobalLayer from "@/components/globalLayer/GlobalLayer.vue";
import FloatLayerHeader from "@/components/floatLayerHeader/FloatLayerHeader.vue";
import {isUndef, limitString} from "@/utils/shared";
import {Prop} from "vue-property-decorator";
import {operationFailMsg, operationSuccessMsg} from "@/utils/shared/message";
import {shopManage} from "@/store/modules/ShopManage";

@Component({
  components: {FloatLayerHeader, GlobalLayer}
})
export default class EditStoreLayer extends Vue {
  @Prop(Number) id!: number;

  @Prop(String) name!: string;

  @Prop(String) intro!: string;

  @Prop(String) status!: string;

  title: string = '编辑门店信息';

  isOpenStatus: string = '营业中';

  isCloseStaus: string = '停业';

  isCreate: boolean = false;

  localName: string = '';

  localIntro: string = '';

  storeStatus: string = '';

  isLoading: boolean = false;

  cancelModal: any = {
    isShow: false
  };

  confirmModal: any = {
    isShow: false,
    msg: ''
  };

  showCancelModal() {
    if (this.localName != this.name || this.localIntro != this.intro) {
      this.cancelModal.isShow = true;
    } else {
      this.cancelHander();
    }
  }

  cancelHander() {
    this.$emit('on-close');
  }

  showConfirmModal() {
    if (this.isLoading) {
      operationFailMsg('请耐心等待后台响应后再点击');
      return ;
    }
    if (this.localName.length == 0) {
      operationFailMsg('请输入门店名');
      return ;
    }
    if (this.storeStatus.length == 0 && !this.isCreate) {
      operationFailMsg('请选择门店状态');
      return ;
    }
    this.confirmModal.isShow = true;
  }

  limitName() {
    this.localName = limitString(this.localName, 25);
  }

  limitIntro() {
    this.localIntro = limitString(this.localIntro, 100);
  }

  renewHandler() {
    this.$emit('on-renew');
    this.cancelHander();
  }

  confirmHandler() {
    // 进行保存或者创建门店
    this.isLoading = true;
    if (this.isCreate) {
      shopManage.addStore({
        storeAddress: this.localIntro,
        storeName: this.localName,
        storeStatus: 0
      }).then(res => {
        this.isLoading = false;
        if (res.isSuccess) {
          operationSuccessMsg('增加门店信息成功');
          this.renewHandler();
        } else {
          operationFailMsg('增加门店信息失败');
        }
      });
    } else {
      shopManage.changeStoreInfo({
        storeId: this.id,
        storeName: this.localName,
        storeAddress: this.localIntro,
        storeStatus: this.storeStatus == this.isOpenStatus ? 1 : 0
      }).then(res => {
        this.isLoading = false;
        if (res.isSuccess) {
          operationSuccessMsg('更新门店信息成功');
          this.renewHandler();
        } else {
          operationFailMsg('更新门店信息失败');
        }
      });
    }
  }

  beforeMount() {
    if (this.id == -1) {
      this.isCreate = true;
      this.title = '新增门店';
    }
    if (this.status == this.isOpenStatus) {
      this.storeStatus = this.isOpenStatus;
    } else if (this.status == this.isCloseStaus) {
      this.storeStatus = this.isCloseStaus;
    }
    this.localIntro = this.intro || '';
    this.localName = this.name || '';
    if (this.storeStatus.length == 0) {
      this.storeStatus = this.status == this.isOpenStatus ? this.isOpenStatus : this.isCloseStaus;
    }
  }
}
</script>
