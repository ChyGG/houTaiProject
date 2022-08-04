<template>
  <div>
    <!-- 共有三个页面互相转换
      添加/修改spu
      显示spu
      添加sku
     -->
    <el-card style="margin: 20px 0">
      <CategorySelect
        @getCategoryId="getCategoryId"
        :show="scene != 0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- 显示spu页面 -->
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-edit"
          :disabled="!cate3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table style="width: 100%" :data="records" border>
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu概述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加sku"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改spu"
                @click="editSpu(row)"
              ></el-button>
              <el-button
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看当前spu列表"
                @click="showInfo(row)"
              ></el-button>
              <el-popconfirm title="确定删除吗？" @onConfirm="deleteSpu(row)">
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除spu"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 
        
       -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="getData"
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 7]"
          :page-size="limit"
          layout="prev,pager,next,jumper,->,sizes,total"
          :total="total"
        >
        </el-pagination>
      </div>
      <!-- 添加或修改sku -->
      <SpuForm
        v-show="scene == 1"
        @changeState="changeState"
        ref="spu"
      ></SpuForm>
      <!-- 添加sku -->
      <SkuForm v-show="scene == 2" ref="sku" @back="back"></SkuForm>
    </el-card>
    <!-- 点击spu列表触发弹框显示sku列表 -->
    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogTableVisible"
      :before-close="close"
    >
      <el-table :data="skuList" style="width: 100%" border v-loading="loading">
        <el-table-column prop="skuName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="price" label="价格" width="width">
        </el-table-column>
        <el-table-column prop="weight" label="重量" width="width">
        </el-table-column>
        <el-table-column label="默认图片" width="width">
          <template slot-scope="{ row }">
            <img
              :src="row.skuDefaultImg"
              alt=""
              style="width: 100px; height: 100px"
            />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SkuForm from "@/views/product/Spu/SkuForm";
import SpuForm from "@/views/product/Spu/SpuForm";
export default {
  name: "Spu",
  data() {
    return {
      cate1Id: "",
      cate2Id: "",
      cate3Id: "",
      page: 1,
      limit: 3,
      records: [],
      total: 0,
      scene: 0,
      dialogTableVisible: false,
      spu: {},
      skuList: [],
      loading: true,
    };
  },
  components: { SkuForm, SpuForm },
  methods: {
    async getData(pages = 1) {
      this.page = pages;
      const { page, limit, cate3Id } = this;
      const result = await this.$api.default.spu.reqGetSkuInfo(
        page,
        limit,
        cate3Id
      );
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    getCategoryId({ eveal, id }) {
      if (eveal == 1) {
        this.cate3Id = "";
        this.cate2Id = "";
        this.cate1Id = id;
      } else if (eveal == 2) {
        this.cate3Id = "";
        this.cate2Id = id;
      } else {
        this.cate3Id = id;
        this.getData();
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getData();
    },
    editSpu(row) {
      this.scene = 1;
      this.$refs.spu.getSpuInfo(row);
    },
    addSpu() {
      this.scene = 1;
      this.$refs.spu.addSpuInfo(this.cate3Id);
    },
    changeState({ scene, flag }) {
      this.scene = scene;
      if (flag == "修改") {
        this.getData(this.page);
      } else {
        this.getData();
      }
    },
    async deleteSpu(row) {
      const result = await this.$api.default.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.getData(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    addSku(row) {
      this.scene = 2;
      this.$refs.sku.getData(this.cate1Id, this.cate2Id, row);
    },
    back(scene) {
      this.scene = scene;
    },
    async showInfo(row) {
      this.dialogTableVisible = true;
      this.spu = row;
      const result = await this.$api.default.sku.reqFindBySpuId(row.id);
      if (result.code == 200) {
        this.skuList = result.data;
        this.loading = false;
      }
    },
    close(done) {
      this.loading = true;
      this.skuList = [];
      done();
    },
  },
};
</script>

<style>
</style>