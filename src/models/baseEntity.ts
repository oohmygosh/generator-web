export interface BaseEntity{
    // 主键
    id?: number
    // 创建人
    createBy?: string
    // 创建人Id
    createId?: number
    // 创建时间
    createTime?: Date
    // 修改人
    updateBy?: string
    // 修改时间
    updateTime?: Date
}