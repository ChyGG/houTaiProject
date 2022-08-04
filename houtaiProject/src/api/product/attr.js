import request from '@/utils/request'

//三级标题接口
export const reqCategory1 = () => request({
    url: '/admin/product/getCategory1',
    method: 'get'
})
export const reqCategory2 = (category1Id) => request({
    url: `/admin/product/getCategory2/${category1Id}`,
    method: 'get'
})
export const reqCategory3 = (category2Id) => request({
    url: `/admin/product/getCategory3/${category2Id}`,
    method: 'get'
})
//获取平台属性接口
export const reqAttrValue = (category1Id, category2Id, category3Id) => request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get'
})
///admin/product/saveAttrInfo post 
export const reqSaveAttrInfo = (data) => request({
    url: 'admin/product/saveAttrInfo',
    method: 'post',
    data
})