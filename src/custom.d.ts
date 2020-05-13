type  RootState = {
    recordList: RecordItem[];
    tagList: Tag[];
    currentTag?: Tag;
}
type RecordItem = {//type相当于js里的var
    tags: Tag[];
    notes: string;
    type: string;
    amount: number; //数据类型
    createdAt?: string; //类
}
type Tag = {
    id: string;
    name: string;
}
type TagListModel = {
    data: Tag[];
    fetch: () => Tag[];
    create: (name: string) => 'success' | 'duplicated';
    save: () => void;
    remove: (id: string) => boolean;
    update: (id: string, name: string) => 'success' | 'not found' | 'duplicated';
}

interface Window {

}