<template>
  <!-- 品牌管理页面 -->
  <div>
    <!-- 添加按钮 -->
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="showDialog"
      >添加</el-button
    >
    <!-- 
      :data="data" 需要展示的数据
     -->
    <!-- 展示数据的表格 -->
    <el-table style="width: 100%; margin-top: 20px" border :data="records">
      <!-- label 列名 -->
      <!-- el-table-column指每一列 -->
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column label="品牌LoGo" width="width">
        <!--解构出来的row是当前的这一行 -->
        <template slot-scope="{ row }">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTrade(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTm(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 
      :current-page当前第几页   :page-sizes可以切换的每页数量   :page-size每页的数量  layout摆放位置 
    -->
    <el-pagination
      style="text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 7]"
      :page-size="limit"
      layout="jumper,prev, pager, next, ->,total, sizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
    </el-pagination>
    <!-- 对话框点击添加或修改按钮弹出 -->
    <!-- 根据formInfo中是否有id决定标题 -->
    <el-dialog
      :title="formInfo.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        style="width: 80%"
        :model="formInfo"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="formInfo.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- 上传区 -->
          <!-- action上传的地址 -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="formInfo.logoUrl"
              :src="formInfo.logoUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddOrUpdateInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    return {
      page: 1, //当前页
      limit: 3, //每页的数据总数
      records: [], //每页的数据
      total: 0, //总数据
      dialogFormVisible: false,
      formInfo: {
        //点击添加或修改暂存的数据
        logoUrl: "",
        tmName: "",
      },
      //校验规则
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 4,
            max: 8,
            message: "长度在 4 到 8 个字符",
            trigger: "change",
          },
        ],
        logoUrl: [{ required: true, message: "请选择品牌LOGO" }],
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    async getData(pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      const result = await this.$api.default.tradeMark.reqTradeMarkList(
        page,
        limit
      );
      if (result.code == 200) {
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    handleSizeChange(limit) {
      this.limit = limit;
      this.getData();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getData(page);
    },
    showDialog() {
      this.dialogFormVisible = true;
      this.formInfo = {
        logoUrl: "",
        tmName: "",
      };
    },
    updateTrade(row) {
      this.dialogFormVisible = true;
      this.formInfo = { ...row };
    },
    handleAvatarSuccess(res, file) {
      this.formInfo.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    AddOrUpdateInfo() {
      //表单验证
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          //验证成功
          this.dialogFormVisible = false;
          let result = await this.$api.default.tradeMark.reqAddOrUpdate(
            this.formInfo
          );
          if (result.code == 200) {
            this.$message(this.formInfo.id ? "修改品牌成功" : "添加品牌成功");
            this.getData(this.page);
          }
        } else {
          return false;
        }
      });
    },
    deleteTm(row) {
      //$confirm elementUi全局的方法弹框
      this.$confirm(`确定删除${row.tmName}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const result = await this.$api.default.tradeMark.reqDeleteTm(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getData(this.records.length > 1 ? this.page : 1);
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

 
<style>
/* scoped属性加上后只对当前组件生效
  若想修改elementUi的默认样式 可以加上类名或在行内样式中修改
*/
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

