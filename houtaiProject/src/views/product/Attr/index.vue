<template>
  <!-- 平台属性管理 -->
  <div>
    <el-card shadow="always" style="margin: 10px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="!isShow"
      ></CategorySelect>
    </el-card>
    <el-card shadow="always" style="margin: 10px 0">
      <el-button
        type="primary"
        icon="el-icon-plus"
        :disabled="!categoryId.cate3"
        @click="addAttr"
        v-show="isShow"
        >添加</el-button
      >
      <div v-show="isShow">
        <el-table :data="attr" style="width: 100%">
          <el-table-column type="index" label="序号" width="80px">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="250px">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 标签 -->
              <el-tag
                type="success"
                v-for="(attrValue, index) in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0 10px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="250px">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
                >修改</el-button
              >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteAttr(row, $index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShow">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="newAttr.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!newAttr.attrName"
          >添加属性值</el-button
        >
        <el-button @click="isShow = true" style="margin: 0 0 20px 10px"
          >取消</el-button
        >
        <el-table
          style="width: 100% margin:10px 0"
          border
          :data="newAttr.attrValueList"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <!--通过$index获取当前dom  -->
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 气泡弹框 -->
              <el-popconfirm
                :title="`确定删除${row.valueName}?`"
                @onConfirm="deleteValue(row, $index)"
              >
                <!-- slot="reference"具名插槽 触发popConfirm产生的文本 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          style="margin: 10px 0"
          @click="saveAttr"
          :disabled="newAttr.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShow = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      categoryId: {
        //分类的Id
        cate1: "",
        cate2: "",
        cate3: "",
      },
      attr: [], //属性值列表
      isShow: true,
      newAttr: {
        //新增属性
        attrName: "",
        attrValueList: [], //属性值列表
        categoryId: 0,
        categoryLevel: 3,
      },
    };
  },
  methods: {
    async getData() {
      const { cate1, cate2, cate3 } = this.categoryId;
      const result = await this.$api.default.attr.reqAttrValue(
        cate1,
        cate2,
        cate3
      );
      if (result.code == 200) {
        this.attr = result.data;
      }
    },
    getCategoryId({ eveal, id }) {
      if (eveal == 1) {
        this.categoryId.cate2 = "";
        this.categoryId.cate3 = "";
        this.categoryId.cate1 = id;
      } else if (eveal == 2) {
        this.categoryId.cate3 = "";
        this.categoryId.cate2 = id;
      } else {
        this.categoryId.cate3 = id;
        this.getData();
      }
    },
    addAttrValue() {
      //点击添加属性值按钮
      this.newAttr.attrValueList.push({
        attrId: this.newAttr.id,
        valueName: "",
        flag: true, //控制input和span的切换
      });
      this.$nextTick(() => {
        //获取列表中最后一行元素的input
        this.$refs[this.newAttr.attrValueList.length - 1].focus();
      });
    },
    addAttr() {
      //点击添加按钮 初始化newAttr 将来保存数据发请求要用到
      this.isShow = false;
      this.newAttr = {
        attrName: "",
        attrValueList: [],
        categoryId: this.categoryId.cate3,
        categoryLevel: 3,
      };
    },
    deleteAttr(row, $index) {
      this.attr.splice($index, 1);
    },
    updateAttr(row) {
      //点击修改按钮触发的事件回调
      // 将数据渲染 并使数据动态化
      this.isShow = false;
      this.newAttr = cloneDeep(row);
      this.newAttr.attrValueList.forEach((element) => {
        this.$set(element, "flag", false);
      });
    },
    toLook(row) {
      if (row.valueName.trim() == "") {
        //trim 删除空格
        this.$message("属性值不合法");
        return;
      }
      // 数组的some方法  如果有一个元素满足条件 就返回true
      let result = this.newAttr.attrValueList.some((item) => {
        if (row != item) {
          //如果不是同一项 再判断属性值名称是否相同
          return row.valueName == item.valueName;
        }
      });
      if (result) {
        this.$message("属性值重复");
        return;
      }
      row.flag = false;
    },
    toEdit(row, index) {
      //点击span显示input并聚焦
      row.flag = true;
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    deleteValue(row, $index) {
      //splice改变原数组
      this.newAttr.attrValueList.splice($index, 1);
    },
    async saveAttr() {
      this.newAttr.attrValueList = this.newAttr.attrValueList.filter((item) => {
        if (item.valueName != "") {
          delete item.flag;
          return true; //将所有item身上的flag属性都删除  为了整理参数发请求
        }
      });

      const result = await this.$api.default.attr.reqSaveAttrInfo(this.newAttr);
      if (result.code == 200) {
        this.$message({ type: "success", message: "修改成功" });
        this.getData();
        this.isShow = true;
      }
    },
  },
};
</script>

<style>
</style>