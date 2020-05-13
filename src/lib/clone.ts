function clone<T>(data: T): T {//接受市民类型就返回什么类型
    return JSON.parse(JSON.stringify(data))
}

export default clone