type Action = {
    id: string;
    label: string;
    content?: string;
    onClick: (id: any) => Promise<void>;
    fixed?: boolean;
};

export default Action;