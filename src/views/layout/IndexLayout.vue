<style lang="scss">
@import "scss/mixin";
.page {
  @include clear-float;

  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: rgba(238, 238, 238, 1);
  display: flex;
  flex-direction: column;

  .page-main-container {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .native-page-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow-x: hidden;
  }
}

.ivu-page-item-active a, .ivu-page-item-active:hover a {
  color: #418c5f!important;
}

.ivu-table {
   background-color: rgba(255, 255, 255, .5)!important;
}

.ivu-page-item-active {
  border-color: #418c5f!important;
}

.ivu-page-item:hover {
  border-color: #418c5f!important;
}

.ivu-page-item a, .ivu-page-item:hover a {
  color: #418c5f!important;
}

.ivu-page-next:hover, .ivu-page-prev:hover {
  border-color: #418c5f!important;
}

.ivu-page-next:hover a, .ivu-page-prev:hover a {
  color: #418c5f!important;
}

.ivu-table td {
  background-color: transparent!important;
}

.ivu-radio-checked .ivu-radio-inner {
  border-color: #418c5f!important;
}

.ivu-radio-inner:after {
  background-color: #418c5f!important;
}

.ivu-radio-focus {
  box-shadow: 0 0 0 2px rgba(65, 140, 95, .2)!important;
}

.ivu-modal-wrap {
  z-index: 999999999!important;
}
</style>

<template>
  <div class="page">
    <el-scrollbar
      :native="false"
    >
      <div class="page-main-container">
        <left-section></left-section>
        <right-section></right-section>
      </div>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import LeftSection from '@/views/layout/leftSection/LeftSection.vue';
import RightSection from '@/views/layout/rightSection/RightSection.vue';
import {getToken} from "@/utils/shared/localStorage";
import {isUndef} from "@/utils/shared";

@Component({
  components: {
    RightSection,
    LeftSection
  }
})
export default class IndexLayout extends Vue {
  created() {
    if (isUndef(getToken())) {
      this.$router.replace('/login');
    }
  }
}
</script>
