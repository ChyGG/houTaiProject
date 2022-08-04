<template>
  <div>
    <!-- 顶部导航区 -->
    <!-- 表单数据收集在model中 -->
    <el-form :inline="true" class="demo-form-inline" :model="vForm">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="vForm.cate1Id"
          @change="handler1"
          :disabled="show"
        >
          <!-- select通过v-model收集option中value的数据 -->
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="(c1, index) in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="vForm.cate2Id"
          @change="handler2"
          :disabled="show"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="(c2, index) in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="vForm.cate3Id"
          @change="handler3"
          :disabled="show"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="(c3, index) in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props: ["show"],
  data() {
    return {
      list1: [], //一级分类的数据
      list2: [],
      list3: [],
      vForm: {
        //表单收集的数据
        cate1Id: "",
        cate2Id: "",
        cate3Id: "",
      },
    };
  },
  mounted() {
    this.getData(); //页面挂载完毕请求一级分类的数据
  },
  methods: {
    async getData() {
      const result = await this.$api.default.attr.reqCategory1();
      if (result.code == 200) {
        this.list1 = result.data;
      }
    },
    async handler1() {
      //一级分类数据改变后 先把二级三级分类的数据置空
      this.vForm.cate2Id = "";
      this.vForm.cate3Id = "";
      // 将收集到的一级分类Id传给父组件
      this.$emit("getCategoryId", { eveal: 1, id: this.vForm.cate1Id });
      //获取二级分类的数据（需要传递一级分类的Id）
      const result = await this.$api.default.attr.reqCategory2(
        this.vForm.cate1Id
      );
      if (result.code == 200) {
        this.list2 = result.data;
      }
    },
    async handler2() {
      this.vForm.cate3Id = "";
      this.$emit("getCategoryId", { eveal: 2, id: this.vForm.cate2Id });
      const result = await this.$api.default.attr.reqCategory3(
        this.vForm.cate2Id
      );
      if (result.code == 200) {
        this.list3 = result.data;
      }
    },
    handler3() {
      this.$emit("getCategoryId", { eveal: 3, id: this.vForm.cate3Id });
    },
  },
};
</script>

<style>
</style>