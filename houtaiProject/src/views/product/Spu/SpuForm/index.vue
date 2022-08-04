<template>
  <!-- 添加/修改spu模块 -->
  <div>
    <el-form ref="form" label-width="80px" :model="spuInfo">
      <el-form-item label="SPU名称">
        <el-input
          placeholder="请输入Spu名字"
          v-model="spuInfo.spuName"
        ></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <!-- select v-model将option中value的数据收集到tmid中 -->
        <el-select placeholder="请选择品牌" v-model="spuInfo.tmId">
          <el-option
            :label="item.tmName"
            :value="item.id"
            v-for="(item, index) in tmList"
            :key="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          placeholder="描述"
          rows="4"
          v-model="spuInfo.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 上传图片：action图片上传的地址  list-type: 文件列表的类型 on-preview:图片预览的时候会出发  on-remove:当删除图片的时候会出发 
         file-list：照片墙需要展示的数据【数组：数组里面的元素务必要有name、url属性】
         on-preview：图片预览功能
         on-remove:删除图片的时候会触发
        -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="uploadSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <!-- 点击放大按钮的弹出层 -->
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectAttr.length}项未选择`"
          v-model="attr"
        >
          <el-option
            :label="unattr.name"
            :value="`${unattr.id}:${unattr.name}`"
            v-for="(unattr, index) in unSelectAttr"
            :key="unattr.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attr"
          @click="addNewAttr"
          >添加销售属性</el-button
        >
        <el-table style="width: 100%" border :data="spuInfo.spuSaleAttrList">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                size="small"
                @blur="changeToButton(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addAttrValue(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="spuInfo.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addSkuSuccess">确定</el-button>
        <el-button @click="cancelAdd">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      dialogImageUrl: "", //上传的图片
      dialogVisible: false, //控制dislog的显示
      //spu属性初始化的时候是一个空的对象,在修改SPU的时候，会想服务器发请求，返回SPU信息（对象），在修改的时候可以利用服务器返回的这个对象收集最新的数据提交给服务器
      //添加SPU，如果是添加SPU的时候并没有向服务器发请求，数据收集到哪里呀[SPU]，收集数据的时候有哪些字段呀，看文档
      spuInfo: {
        category3Id: 0,
        description: "",
        spuName: "",
        tmId: "",
        spuImageList: [],
        spuSaleAttrList: [],
      }, //spu信息
      tmList: [], //品牌信息列表
      spuImageList: [], //spu图片列表
      saleAttrList: [], //销售属性列表
      attr: "",
    };
  },
  methods: {
    //照片墙图片上传成功的回调
    uploadSuccess(response, file, fileList) {
      this.spuImageList = fileList;
    },
    handleRemove(file, fileList) {
      //file参数:代表的是删除的那个张图片
      //fileList:照片墙删除某一张图片以后，剩余的其他的图片
      // console.log(file, fileList,22222);
      //收集照片墙图片的数据
      //对于已有的图片【照片钱中显示的图片：有name、url字段的】，因为照片墙显示数据务必要有这两个属性
      //对于服务器而言，不需要name、url字段，将来对于有的图片的数据在提交给服务器的时候，需要处理的
      this.spuImageList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    async getSpuInfo(checkedSpu) {
      //获取SPU信息的数据
      const spuInfoResult = await this.$api.default.spu.reqGetSpuById(
        checkedSpu.id
      );
      if (spuInfoResult.code == 200) {
        this.spuInfo = spuInfoResult.data;
      }
      //获取品牌的信息
      const tmListResult = await this.$api.default.spu.reqGetTradeMarkList();
      if (tmListResult.code == 200) {
        this.tmList = tmListResult.data;
      }
      //获取spu图片的数据
      const spuImageResult = await this.$api.default.spu.reqGetSpuImageList(
        checkedSpu.id
      );
      if (spuImageResult.code == 200) {
        const newArr = spuImageResult.data;
        //由于照片墙显示图片的数据需要数组，数组里面的元素需要有name与url字段
        //需要把服务器返回的数据进行修改
        newArr.forEach((element) => {
          element.name = element.imgName;
          element.url = element.imgUrl;
        });
        //把整理好的数据赋值给要传递的数据
        this.spuImageList = newArr;
      }
      //获取平台全部的销售属性
      const saleAttrListResult =
        await this.$api.default.spu.reqGetSaleAttrList();
      if (saleAttrListResult.code == 200) {
        this.saleAttrList = saleAttrListResult.data;
      }
    },
    addNewAttr() {
      //已经收集需要添加的销售属性的信息
      //把收集到的销售属性数据进行分割
      const [baseSaleAttrId, saleAttrName] = this.attr.split(":");
      const newAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      };
      //添加新的销售属性
      this.spuInfo.spuSaleAttrList.push(newAttr);
      //清空数据
      this.attr = "";
    },
    addAttrValue(row) {
      //点击销售属性值当中添加按钮的时候，需要有button变为input,通过当前销售属性的inputVisible控制
      //挂载在销售属性身上的响应式数据inputVisible，控制button与input切换
      this.$set(row, "inputVisible", true);
      //通过响应式数据inputValue字段收集新增的销售属性值
      this.$set(row, "inputValue", "");
    },
    changeToButton(row) {
      //修改inputVisible为false，显示button
      row.inputVisible = false;
      //解构出销售属性当中收集数据
      const { baseSaleAttrId, inputValue } = row;
      //新增的销售属性值的名称不能为空
      if (inputValue.trim() == "") return this.$message("属性值不能为空");
      const result = row.spuSaleAttrValueList.every(
        (item) => item.saleAttrValueName != inputValue
      );
      if (result) {
        const newAttrValue = { baseSaleAttrId, saleAttrValueName: inputValue };
        row.spuSaleAttrValueList.push(newAttrValue);
      } else this.$message("属性值重复");
    },
    async addSkuSuccess() {
      //整理参数：需要整理照片墙的数据
      //携带参数：对于图片，需要携带imageName与imageUrl字段
      this.spuInfo.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: item.imgUrl || (item.response && item.response.data),
        };
      });
      const result = await this.$api.default.spu.reqAddAndUpdataSpu(
        this.spuInfo
      );
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: "修改成功",
        });
        //通知父组件回到spu首页
        this.$emit("changeState", {
          scene: 0,
          flag: this.spuInfo.id ? "修改" : "添加",
        });
      }
      //清除数据 下次新增数据都为空
      Object.assign(this._data, this.$options.data());
    },
    async addSpuInfo(cate3Id) {
      this.spuInfo.category3Id = cate3Id;
      const tmListResult = await this.$api.default.spu.reqGetTradeMarkList();
      if (tmListResult.code == 200) {
        this.tmList = tmListResult.data;
      }
      const saleAttrListResult =
        await this.$api.default.spu.reqGetSaleAttrList();
      if (saleAttrListResult.code == 200) {
        this.saleAttrList = saleAttrListResult.data;
      }
    },
    cancelAdd() {
      //清理数据
      //Object.assign:es6中新增的方法可以合并对象
      //组件实例this._data,可以操作data当中响应式数据
      //this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空的
      this.$emit("changeState", { scene: 0, flag: "" });
      Object.assign(this._data, this.$options.data());
    },
  },
  computed: {
    //整个平台的销售属性一共三个：尺寸、颜色、版本 ----saleAttrList
    //当前SPU拥有的属于自己的销售属性SPU.spuSaleAttrList  ----颜色
    //数组的过滤方法，可以从已有的数组当中过滤出用户需要的元素，并未返回一个新的数据
    unSelectAttr() {
      const result = this.saleAttrList.filter((element) => {
        return this.spuInfo.spuSaleAttrList.every((item) => {
          return element.name != item.saleAttrName;
        });
      });
      return result;
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>