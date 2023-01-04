import {Generator} from "@/models/generator";

declare namespace Api{

    type ApiModel = {
        [key: string]: string
    }

    type GeneratorParam = {
        id: number,
        tables: Generator.SysGeneratorTable[] | undefined
    }

}