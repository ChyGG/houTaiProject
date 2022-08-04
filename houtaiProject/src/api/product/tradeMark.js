import request from '@/utils/request'
export const reqTradeMarkList = (page, limit) => request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: 'get'
})
//新增品牌 /admin/product/baseTrademark/save
//修改品牌 /admin/product/baseTrademark/update
export const reqAddOrUpdate = (trademark) => {
    if (trademark.id) {
        return request({
            url: '/admin/product/baseTrademark/update',
            method: 'put',
            data: trademark
        })
    } else {
        return request({
            url: '/admin/product/baseTrademark/save',
            method: 'post',
            data: trademark
        })
    }
}
//删除品牌
export const reqDeleteTm = (id) => request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'delete'
})

