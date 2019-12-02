<style lang="scss" scoped>
@import "scss/shared";
@import "scss/mixin";
.edit-package-container {
  position: relative;
  width:720px;
  height:380px;
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
        <span class="item-key">用户姓名</span>
        <input
          class="item-input"
          v-model="localName"
          @input="limitName"
        />
      </div>
      <div class="item-container">
        <span class="item-key">用户电话</span>
        <input
          class="item-input"
          v-model="localPhone"
          @input="limitPhone"
        />
      </div>
      <div class="item-container">
        <span class="item-key">用户性别</span>
        <RadioGroup v-model="localSex" style="margin-left: .2rem">
          <Radio :label="male"></Radio>
          <Radio :label="female" style="margin-left: .2rem"></Radio>
        </RadioGroup>
      </div>
      <div class="item-container">
        <div class="half-section">
          <span class="item-key" style="margin-top: .05rem">用户余额</span>
          <InputNumber :max="10000" :min="0" v-model="localMoney" style="margin-left: 0.2rem;width: 2.2rem"></InputNumber>
        </div>
        <div class="half-section">
          <span class="item-key" style="margin-top: .05rem">用户积分</span>
          <InputNumber :max="10000" :min="0" v-model="localScore" style="margin-left: 0.2rem;width: 2.2rem"></InputNumber>
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
        <p v-if="isCreate">确定增加用户: </p>
        <p v-else>确定将用户修改为: </p>
        <p>用户名: <span style="font-weight: bold;color: #418c5f;font-size: .2rem">{{ localName }}</span></p>
        <p>用户电话: <span style="font-weight: bold;color: #418c5f;font-size: .2rem">{{ localPhone }}</span></p>
        <p>用户性别: <span style="font-weight: bold;color: #418c5f;font-size: .2rem">{{ localSex }}</span></p>
        <p>用户金额: <span style="font-weight: bold;color: #418c5f;font-size: .2rem">{{ localMoney }}</span></p>
        <p>用户积分: <span style="font-weight: bold;color: #418c5f;font-size: .2rem">{{ localScore }}</span></p>
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
import {userManageRequest} from "@/api/UserManageRequest";
import {userListManage} from "@/store/modules/UserListManage";
@Component({
  components: {FloatLayerHeader, GlobalLayer}
})
export default class EditUserInfo extends Vue {
  @Prop(Number) id!: number;

  @Prop(String) name!: string;

  @Prop(String) phone!: string;

  @Prop(String) sex!: string;

  @Prop(Number) money!: number;

  @Prop(Number) score!: number;

  localName: string = '';

  localPhone: string = '';

  localSex: string = '';

  localMoney: number = 0;

  localScore: number = 0;

  male: string = '男';

  female: string = '女';

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

  limitPhone() {
    this.localPhone = limitString(this.localPhone, 11);
  }

  closeLayer() {
    this.$emit('on-close');
  }

  showCancelModal() {
    if (this.localName != this.name
      || this.localMoney != this.money
      || this.localSex != this.sex
      || this.localPhone != this.phone
      || this.score != this.localScore
    ) {
      this.cancelModal.isShow = true;
    } else {
      this.cancelHander();
    }
  }

  confirmHandler() {
    this.isLoading = true;
    if (this.isCreate) {
      userListManage.addUser({
        name: this.localName,
        sex: this.localSex,
        rareMoney: this.localMoney,
        score: this.localScore,
        tel: this.localPhone
      }).then(res => {
        this.isLoading = false;
        if (res.isSuccess) {
          operationSuccessMsg('增加哟用户成功');
          this.renewHandler();
        } else {
          operationFailMsg('增加用户失败');
          operationFailMsg(res.msg);
        }
      });
    } else {
      userListManage.updateUserInfo({
        userId: this.id,
        name: this.localName,
        sex: this.localSex,
        rareMoney: this.localMoney,
        score: this.localScore,
        tel: this.localPhone
      }).then(res => {
        this.isLoading = false;
        if (res.isSuccess) {
          operationSuccessMsg('修改用户成功');
          this.renewHandler();
        } else {
          operationFailMsg('修改用户失败');
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
      operationFailMsg('请输入用户名');
      return ;
    }
    if (this.localPhone.length == 0) {
      operationFailMsg('请输入电话号码');
      return ;
    }
    if (this.localMoney < 0) {
      operationFailMsg('请输入大于0的金额数');
      return ;
    }
    if (this.localScore < 0) {
      operationFailMsg('请输入大于0的积分');
      return ;
    }
    if (!(/^1[3456789]\d{9}$/.test(this.localPhone))) {
      operationFailMsg('请输入正确的手机号码');
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
    this.localPhone = this.phone;
    this.localScore = this.score;
    this.localMoney = this.money;
    this.localSex = this.sex;
  }
}
</script>
