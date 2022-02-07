type Column = {
    id: string;
    label: string;
    sortable?: boolean;
    format?: (value: any) => string;
};

export default Column;