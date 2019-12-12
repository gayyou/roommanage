<style lang="scss" scoped>
@import "scss/shared";
@import "scss/mixin";
.edit-package-container {
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

  .half-section {
    @include clear-float;

    width: 50%;
    display: flex;
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
    <div class="edit-package-container">
      <float-layer-header
        :name="title"
        :no-search="true"
        @on-close="closeLayer"
      ></float-layer-header>
      <div class="item-container">
        <span class="item-key">套餐名称</span>
        <input
          class="item-input"
          v-model="localName"
          @input="limitName"
        />
      </div>
      <div class="item-container">
        <span class="item-key">套餐类型</span>
        <input
          class="item-input"
          v-model="localType"
          @input="limitType"
        />
      </div>
      <div class="item-container">
        <span class="item-key">套餐详情</span>
        <textarea
          class="text-area"
          v-model="localDetail"
          @input="limitDetail"
        ></textarea>
      </div>
      <div class="item-container">
        <div class="half-section">
          <span class="item-key" style="margin-top: .05rem">套餐金额</span>
          <InputNumber :max="5000" :min="0" v-model="localMoney" style="margin-left: 0.2rem;width: 2.2rem"></InputNumber>
        </div>
        <div class="half-section">
          <span class="item-key" style="margin-top: .05rem">套餐天数</span>
          <InputNumber :max="1000" :min="0" v-model="localDays" style="margin-left: 0.2rem;width: 2.2rem"></InputNumber>
        </div>
      </div>
      <div class="item-container">
        <div class="half-section">
          <span class="item-key" style="margin-top: .05rem">使用次数</span>
          <InputNumber :max="1000" :min="0" v-model="localTimes" style="margin-left: 0.2rem;width: 2.2rem"></InputNumber>
        </div>
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
        <p v-if="isCreate">确定增加套餐: </p>
        <p v-else>确定将套餐修改为: </p>
        <p>套餐名: <span style="font-weight: bold;color: #418c5f;font-size: .2rem">{{ localName }}</span></p>
        <p>套餐类型: <span style="font-weight: bold;color: #418c5f;font-size: .2rem">{{ localType }}</span></p>
        <p>套餐详情: <span style="font-weight: bold;color: #418c5f;font-size: .2rem">{{ localDetail }}</span></p>
        <p>套餐金额: <span style="font-weight: bold;color: #418c5f;font-size: .2rem">{{ localMoney }}</span></p>
        <p>套餐天数: <span style="font-weight: bold;color: #418c5f;font-size: .2rem">{{ localDays }}</span></p>
        <p>使用次数: <span style="font-weight: bold;color: #418c5f;font-size: .2rem">{{ localTimes }}</span></p>
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
import {operationFailMsg, operationSuccessMsg} from "@/utils/shared/message";
import {packageManage} from "@/store/modules/PackageManage";
@Component({
  components: {FloatLayerHeader, GlobalLayer}
})
export default class EditPackage extends Vue {
  @Prop(Number) id!: number;

  @Prop(String) name!: string;

  @Prop(String) detail!: string;

  @Prop(String) type!: string;

  @Prop(Number) money!: number;

  @Prop(Number) days!: number;

  @Prop(Number) times!: number;

  localName: string = '';

  localType: string = '';

  localDetail: string = '';

  localMoney: number = 0;

  localDays: number = 0;

  localTimes: number = 0;

  title: string = '编辑套餐';

  isCreate: boolean = false;

  isLoading: boolean = false;

  cancelModal: any = {
    isShow: false
  };

  confirmModal: any = {
    isShow: false,
    msg: ''
  };

  limitName() {
    this.localName = limitString(this.localName, 25);
  }

  limitType() {
    this.localType = limitString(this.localType, 20);
  }

  limitDetail() {
    this.localDetail = limitString(this.localDetail, 150);
  }

  closeLayer() {
    this.$emit('on-close');
  }

  showCancelModal() {
    if (this.localName != this.name
      || this.localMoney != this.money
      || this.localDetail != this.detail
      || this.localType != this.type
      || this.localDays != this.days
    ) {
      this.cancelModal.isShow = true;
    } else {
      this.cancelHander();
    }
  }

  confirmHandler() {
    this.isLoading = true;
    if (this.isCreate) {
      packageManage.addPackage({
        mealDays: this.localDays,
        mealDesc: this.localDetail,
        mealMoney: this.localMoney,
        mealName: this.localName,
        mealType: this.localType,
        usedTime: this.localTimes
      }).then(res => {
        this.isLoading = false;
        if (res.isSuccess) {
          operationSuccessMsg('增加套餐成功');
          this.renewHandler();
        } else {
          operationFailMsg('增加套餐失败');
          operationFailMsg(res.msg);
        }
      });
    } else {
      packageManage.updatePackage({
        mealId: this.id,
        mealDays: this.localDays,
        mealDesc: this.localDetail,
        mealMoney: this.localMoney,
        mealName: this.localName,
        mealType: this.localType,
        usedTime: this.localTimes
      }).then(res => {
        this.isLoading = false;
        if (res.isSuccess) {
          operationSuccessMsg('修改套餐成功');
          this.renewHandler();
        } else {
          operationFailMsg('修改套餐失败');
          operationFailMsg(res.msg);
        }
      });
    }
  }

  renewHandler() {
    this.$emit('on-renew');
    this.cancelHander();
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
      operationFailMsg('请输入套餐名称');
      return ;
    }
    if (this.localType.length == 0) {
      operationFailMsg('请输入套餐类型');
      return ;
    }
    if (this.localMoney <= 0) {
      operationFailMsg('请输入大于0的金额数');
      return ;
    }
    if (this.localDays <= 0) {
      operationFailMsg('请输入大于0的天数');
      return ;
    }
    if (this.localTimes <= 0) {
      operationFailMsg('请输入大于0的使用次数')
      return ;
    }
    let daysString = this.localDays.toString();
    if (!/^[1-9]+[0-9]*]*$/.test(daysString)) {
      operationFailMsg('请输入整数的天数');
      return ;
    }
    let timeString = this.localTimes.toString();
    if (!/^[1-9]+[0-9]*]*$/.test(timeString)) {
      operationFailMsg('请输入整数的使用次数');
      return ;
    }
    this.confirmModal.isShow = true;
  }

  beforeMount() {
    if (this.id == -1) {
      this.isCreate = true;
      this.title = '新增套餐';
    }
    this.localName = this.name;
    this.localDetail = this.detail;
    this.localType = this.type;
    this.localMoney = this.money;
    this.localDays = this.days;
    this.localTimes = this.times;
  }
}
</script>
