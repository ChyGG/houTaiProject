//将四个模块的接口统一暴露
import * as tradeMark from '@/api/product/tradeMark'
import * as attr from '@/api/product/attr'
import * as sku from '@/api/product/sku'
import * as spu from '@/api/product/spu'
export default {
    tradeMark,
    attr,
    sku,
    spu
}