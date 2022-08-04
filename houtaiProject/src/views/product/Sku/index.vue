<template>
  <div>
    <el-table style="width: 100%" border :data="records">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column prop="prop" label="默认图片" width="110px">
        <template slot-scope="{ row }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 80px; height: 80px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80px">
      </el-table-column>
      <el-table-column prop="price" label="价格" width="80px">
      </el-table-column>
      <el-table-column label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            type="info"
            icon="el-icon-top"
            size="mini"
            @click="upload(row)"
            v-if="row.isSale == 0"
            title="点击上架"
          ></el-button>
          <el-button
            v-else
            type="success"
            icon="el-icon-bottom"
            size="mini"
            @click="cancel(row)"
            title="点击下架"
          ></el-button>
          <el-button type="warning" icon="el-icon-edit" size="mini"></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="showInfo(row)"
          ></el-button>
          <el-popconfirm
            title="确定删除吗？"
            @onConfirm="deleteSku(row)"
            style="margin-left: 10px"
          >
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

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getData"
      style="text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="10"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
    >
    </el-pagination>
    <!-- 抽屉效果 -->
    <el-drawer :visible.sync="drawer" direction="rtl" size="50%">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="12">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="12">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="12">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="12">
          <el-tag
            style="margin-right: 10px"
            type="success"
            v-for="(attr, index) in skuInfo.skuAttrValueList"
            :key="attr.id"
            >{{ attr.attrId }}-{{ attr.valueId }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="12">
          <el-carousel height="300px">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img
                :src="item.imgUrl"
                alt=""
                style="width: 100%; height: 100%"
              />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 10,
      records: [], //存储SKU列表的数据
      total: 0,
      skuInfo: {}, //存储SKU信息
      drawer: false,
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    //获取sku列表的方法
    async getData(pages = 1) {
      this.page = pages;
      const { page, limit } = this;
      const result = await this.$api.default.sku.reqGetSkuInfo(page, limit);
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getData();
    },
    //下架
    async cancel(row) {
      const result = await this.$api.default.sku.reqCancelSale(row.id);
      if (result.code == 200) {
        row.isSale = 0;
        this.$message({
          type: "success",
          message: "下架成功",
        });
      }
    },
    //上架
    async upload(row) {
      const result = await this.$api.default.sku.reqOnSale(row.id);
      if (result.code == 200) {
        row.isSale = 1;
        this.$message({
          type: "success",
          message: "上架成功",
        });
      }
    },
    async deleteSku(row) {
      const result = await this.$api.default.sku.reqDeleteSku(row.id);
      if (result.code == 200) {
        this.getData(this.limit > 1 ? this.page : this.page - 1);
      }
    },
    async showInfo(row) {
      this.drawer = true;
      const result = await this.$api.default.sku.reqGetSkuById(row.id);
      if (result.code == 200) {
        this.skuInfo = result.data;
      }
    },
  },
};
</script>

<style>
.el-col-5 {
  text-align: right;
}
.el-col {
  margin: 10px;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.el-carousel__button {
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: yellowgreen;
}
</style>