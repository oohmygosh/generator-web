import {BaseEntity} from "@/models/baseEntity";

/**
 * 代码生成器
 */
declare namespace Generator {
    /**
     * 数据库
     *
     * @author Lee
     * @since 2022-12-29
     */
    interface SysGeneratorDb extends BaseEntity {
        //数据库连接URL
        url?: string
        //密码
        password?: string
        //数据库类型
        dbType?: string
        //数据库描述
        comment?: string
        //0：未删除 1：删除
        deleted?: number
        //数据库名称
        dbName?: string
        //用户名
        username?: string
    }

    /**
     * 代码生成表资源
     *
     * @author oohmygosh
     * @since 2023-01-03
     */
    interface SysGeneratorTable extends BaseEntity {
        //数据源Id
        dbId?: number
        //表名
        name?: string
        // 表注释
        comment?: string
        // 表策略
        tableStrategy?: SysGeneratorTableStrategy
        // 表字段
        fields?: SysGeneratorField[]
        // mock 条数
        mockNum?: number
    }

    /**
     * 代码生成策略
     *
     * @author oohmygosh
     * @since 2023-01-04
     */
    interface SysGeneratorStrategy extends BaseEntity {
        // 数据源Id
        pid: number
        // 包路径
        packagePath?: string
        // 作者
        author?: string
        // 表前缀
        tablePrefix?: string[]
        // 表后缀
        tableSuffix?: string[]
    }

    /**
     * 表生成策略
     *
     * @author oohmygosh
     * @since 2023-01-03
     */
    interface SysGeneratorTableStrategy extends BaseEntity {
        // 表Id
        tableId?: number
        // 包路径
        packagePath?: string
        // 作者
        author?: string
        // Swagger配置
        swagger?: boolean
        // @Mapper注解
        mapper?: boolean
        // 参数校验
        validation?: boolean
        // mock 数量
        mockNum?: number
        // lombok配置
        lombok: LombokConfig
        // 超类Id
        superclass: number[]
        // 模板Id
        templates: number[]
        // 命名策略
        tableSuffix?: string[]
        // 字段前缀
        fieldPrefix?: string[]
        // 字段后缀
        fieldSuffix?: string[]
    }

    /**
     * Lombok配置
     */
    interface LombokConfig {
        // @Builder
        builder: boolean
        // @NoArgsConstructor
        noArgsConstructor: boolean
        // @AllArgsConstructor
        allArgsConstructor: boolean
        // @ToString
        toString: boolean
        // @EqualsAndHashCode
        equalsAndHashCode: boolean
        // @Data
        data: boolean
        // @Getter & @Setter
        getterAndSetter: boolean
    }

    /**
     * 代码生成表字段
     *
     * @author oohmygosh
     * @since 2023-01-03
     */
    interface SysGeneratorField extends BaseEntity {
        // 表Id
        tableId: number
        // 字段名
        name: string
        // 模拟数据类型
        mockType?: string
        // 模拟数据参数
        mockParam?: string
        // 数据类型
        jdbcType: string
        // 数据范围
        scale?: number
        // 默认值
        defaultValue?: string
        // 注释
        comment: string
        // 可为空
        nullable?: boolean
        // 属性名
        propertyName?: string
        // 主键
        primaryKey?: boolean
        // 自增
        autoIncrement?: boolean
        // 长度
        length?: number
    }

    /**
     * 生成器模板
     *
     * @author oohmygosh
     * @since 2023-01-06
     */
    interface SysGeneratorTemplate extends BaseEntity {
        // 0:entity 1:mapper 2:service 3:serviceImpl 4:controller 5:xml
        type: Type | number
        // 0:velocity 1:beetl 2:freemarker
        templateType: number
        // 模板
        template?: any
        // 模板名称
        name: string
        // 应用名
        app: string
    }

    /**
     * 父类
     *
     * @author oohmygosh
     * @since 2023-01-06
     */
    interface SysGeneratorSuperclass extends BaseEntity {
        // 0:entity 1:mapper 2:service 3:serviceImpl 4:controller
        type: Type | number
        // 公共字段
        field?: Field[]
        // 应用
        app: string
        // 类名
        name: string
        // 包路径
        path?: string
    }

    type Field = {
        // 字段名
        name: string
        // 字段填充
        fieldFill: string
        // 包路径
        packagePath?: string
    }

    type Type = {
        desc?: string
        code: number
        language?: string
    }

    interface renderResults {
        renderResults: RenderResult[]
    }

    /**
     * 渲染结果
     */
    interface RenderResult {
        // 内容
        content: string
        // 类型
        type: Type
        // path
        path: string
    }

}
