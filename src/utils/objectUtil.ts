export const clearObj = <T extends { [key: string]: any | object }>(obj: T) => {
    for (const key in obj) {
        if (obj[key] && typeof obj[key] === 'object')
            clearObj(obj[key])
        else
            obj[key] = null as any
    }
}