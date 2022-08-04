<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="SPU名称">{{ spu.spuName }} </el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input
          placeholder="价格(元)"
          v-model="skuInfo.price"
          type="number"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item
            :label="attr.attrName"
            v-for="(attr, index) in attrInfoList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.attrAndattrValue">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="(attrValue, index) in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item
            :label="saleAttrList.saleAttrName"
            v-for="(saleAttrList, index) in spuSaleAttrList"
            :key="saleAttrList.id"
          >
            <el-select placeholder="请选择" v-model="saleAttrList.idAndValueId">
              <el-option
                :label="saleAttrValueList.saleAttrValueName"
                :value="`${saleAttrValueList.id}:${saleAttrList.id}`"
                v-for="(
                  saleAttrValueList, index
                ) in saleAttrList.spuSaleAttrValueList"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          border
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="80px"> </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{ row, $index }">
              <img :src="row.imgUrl" style="width: 100px; height: 100px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                v-if="row.skuDesc == 0"
                @click="changeToDesc(row)"
                >设为默认</el-button
              >
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSkuInfo">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      skuInfo: {
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        price: 0,
        skuAttrValueList: [
          //存储平台属性的数据
          /*   {
            attrId: 0,
            skuId: 0,
          }, */
        ],
        skuDefaultImg: "",
        skuDesc: "",
        skuName: "",
        weight: "",

        skuImageList: [
          //存储图片的信息
          /*  {
            id: 0,
            imgName: "string",
            imgUrl: "string",
            isDefault: "string",
            skuId: 0,
            spuImgId: 0,
          }, */
        ],
        skuSaleAttrValueList: [
          //存储销售是属性
          /*  {
            id: 0,
            saleAttrId: 0,
            saleAttrName: "string",
            saleAttrValueId: 0,
            saleAttrValueName: "string",
            skuId: 0,
            spuId: 0,
          }, */
        ],
      },
      spuImageList: [], //存储图片的信息
      spuSaleAttrList: [], //存储销售属性
      attrInfoList: [], //存储平台属性的数据
      spu: {},
      //收集图片的数据字段:但是需要注意，收集的数据目前缺少isDefault字段，将来提交给服务器数据的时候，需要整理参数
      imgList: [],
    };
  },
  methods: {
    //获取SkuForm数据
    async getData(cate1Id, cate2Id, row) {
      this.skuInfo.category3Id = row.category3Id;
      this.skuInfo.spuId = row.id;
      this.skuInfo.tmId = row.tmId;
      this.spu = row;
      //获取图片的数据
      const result = await this.$api.default.sku.reqSpuImageList(row.id);
      if (result.code == 200) {
        let list = result.data;
        list.forEach((element) => {
          element.skuDesc = 0;
        });
        this.spuImageList = list;
      }
      //获取销售属性的数据
      const result1 = await this.$api.default.sku.reqSpuSaleAttrList(row.id);
      if (result1.code == 200) {
        this.spuSaleAttrList = result1.data;
      }
      //获取平台属性的数据
      const result2 = await this.$api.default.sku.reqAttrInfoList(
        cate1Id,
        cate2Id,
        row.category3Id
      );
      if (result2.code == 200) {
        this.attrInfoList = result2.data;
      }
    },
    //table表格复选框按钮的事件
    handleSelectionChange(params) {
      //获取到用户选中图片的信息数据，但是需要注意，当前收集的数据当中，缺少isDefault字段
      this.imgList = params;
    },
    changeToDesc(row) {
      //图片列表的数据的isDefault字段变为 0
      this.spuImageList.forEach((element) => {
        element.skuDesc = 0;
      });
      row.skuDesc = 1;
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    cancel() {
      //自定义事件，让父组件切换场景0回到spuInfo首页
      this.$emit("back", 0);
      Object.assign(this._data, this.$options.data());
    },
    async saveSkuInfo() {
      //整理参数
      //整理平台属性
      const { skuInfo, attrInfoList, spuSaleAttrList, imgList } = this;
      //整理平台属的数据
      skuInfo.skuAttrValueList = attrInfoList.reduce((prev, item) => {
        if (item.attrAndattrValue) {
          const [attrId, valueId] = item.attrAndattrValue.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      //reduce() 方法对数组中的每个元素按序执行一个由你提供的 reducer 函数，
      //每次运行都会 将先前元素的计算结果作为参数传入，最后将其结果 汇总为单个返回值。

      //当第一次执行这个回调函数的时候，不存在 “上一次计算的结果”，
      //所以如果需要回调函数从数组索引为 0 的元素开始执行，就需要传递 初始值 否则索引号为 0 的元素将会被 作为初始值 initialValue，迭代器将从第二个元素开始执行

      skuInfo.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.idAndValueId) {
          const [saleAttrId, saleAttrValueId] = item.idAndValueId.split(":");
          prev.push({ saleAttrId, saleAttrValueId });
        }
        return prev;
      }, []);
      //整理图片的数据
      skuInfo.skuImageList = imgList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      const result = await this.$api.default.sku.reqSaveSkuInfo(skuInfo);
      if (result.code == 200) {
        this.$emit("back", 0);
        Object.assign(this._data, this.$options.data());
      }
    },
  },
};
</script>

<style>
</style>