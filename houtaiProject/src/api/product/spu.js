import request from '@/utils/request'
export const reqGetSkuInfo = (page, limit, category3Id) => request({
    url: `/admin/product/${page}/${limit}`,
    method: 'get',
    params: { category3Id }
})

///admin/product/getSpuById/{spuId} 获取spu信息 get
export const reqGetSpuById = (spuId) => request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: 'get'
})
//获取商品列表
export const reqGetTradeMarkList = () => request({
    url: `/admin/product/baseTrademark/getTrademarkList`,
    method: 'get'
})
//获取spu图片信息
export const reqGetSpuImageList = (spuId) => request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: 'get'
})
//获取销售属性
export const reqGetSaleAttrList = () => request({
    url: `/admin/product/baseSaleAttrList`,
    method: 'get'
})
//修改spu和新增spu
export const reqAddAndUpdataSpu = (spuInfo) => {
    if (spuInfo.id) {
        return request({
            url: "/admin/product/updateSpuInfo",
            method: 'post',
            data: spuInfo
        })
    } else {
        return request({
            url: "/admin/product/saveSpuInfo",
            method: 'post',
            data: spuInfo
        })
    }
}

export const reqDeleteSpu = (spuId) => request({
    url: `/admin/product/deleteSpu/${spuId}`,
    method: 'delete'
})