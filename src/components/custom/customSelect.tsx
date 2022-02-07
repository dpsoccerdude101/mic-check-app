import { ReactNode } from 'react';
import { FormControl, Select } from '@material-ui/core';

const classes = {
    select: {
        color: '#808191',
        fontFamily: 'sofia-pro',
        fontSize: '.9rem',
        fontWeight: 600,
        paddingLeft: '10px',
        background: 'rgba(228,228,228,0.25)',
    },
} as const;

type CustomSelectProps = {
    styles?: Record<string, unknown>;
    className?: string;
    multiple?: boolean;
    handleChange: (value: any) => void;
    value: any;
    options: ReactNode[];
};

const CustomSelect = ({
    value,
    handleChange,
    options,
    className,
    styles = {},
    multiple = false,
}: CustomSelectProps) => {
    return (
        <FormControl>
            <Select
                sx={{ ...classes.select, ...styles }}
                className={className}
                multiple={multiple}
                native
                title='Select Sort By'
                value={value}
                onChange={(e) => {
                    handleChange(e.target.value);
                }}
                inputProps={{
                    name: 'sort',
                    id: 'select-sort',
                }}
            >
                {options}
            </Select>
        </FormControl>
    );
};

export default CustomSelect;
