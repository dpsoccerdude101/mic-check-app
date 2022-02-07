import { useState } from 'react';
import { MenuItem, Select, FormControl } from '@material-ui/core';
import { MusicalGenre } from 'src/types';

type Props = {
    handleChange: (value: MusicalGenre[]) => void;
    initialGenres: MusicalGenre[];
    values: MusicalGenre[];
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 186.4,
        },
    },
};

const classes = {
    select: {
        color: '#808191',
        fontFamily: 'sofia-pro',
        fontSize: '.9rem',
        fontWeight: '600',
        paddingLeft: '10',
        background: 'rgba(228,228,228,0.25)',
    },
} as const;

const getMusicalGenreArrFromStringArr: (
    newValues: string[],
    genreOptions: MusicalGenre[]
) => MusicalGenre[] = (newValues: string[], genreOptions: MusicalGenre[]) =>
    newValues.map((elem) => {
        return {
            name: elem,
            /**
             * O(n * 5)
             */
            id: genreOptions.find((genreOption) => genreOption.name === elem)
                .id,
        };
    }) as MusicalGenre[];

const formatSelectedGenres = (newValues: string[]) => {
    let tempValues = newValues.slice();
    /**
     * If 'All Genres' is selected, then clear all other genre selections
     * Else if a new genre is selected that is not 'All Genres' then ommit 'All Genres'
     * from genre selection.
     */
    tempValues =
        tempValues[tempValues.length - 1] === 'All Genres'
            ? tempValues.slice(-1)
            : tempValues.filter((elem) => elem !== 'All Genres');

    /**
     * If a sixth genre is selected, then pop the first one off
     */
    if (tempValues.length > 5) tempValues = tempValues.slice(1, 6);
    return tempValues;
};

const CustomSelectGenreTags = ({
    initialGenres: genreOptions,
    values,
    handleChange,
}: Props) => {
    const [open, setOpen] = useState<boolean>(false);
    const [tempValues, setTempValues] = useState<MusicalGenre[]>(values);

    const addSelectedGenre = (e) => {
        const newValues = formatSelectedGenres(e.target.value as string[]);

        const selectedGenreArr = getMusicalGenreArrFromStringArr(
            newValues,
            genreOptions
        );
        setTempValues(selectedGenreArr);
    };

    return (
        <FormControl sx={{ minWidth: '186.4px' }}>
            <Select
                id='musical-genre-select'
                multiple
                title='Select Genre Filter'
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => {
                    handleChange(tempValues);
                    setOpen(false);
                }}
                sx={{ ...classes.select }}
                MenuProps={{ ...MenuProps }}
                value={tempValues.map((elem) => elem.name)}
                onChange={addSelectedGenre}
            >
                {genreOptions.map((genre) => (
                    <MenuItem key={genre.id} value={genre.name}>
                        {genre.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default CustomSelectGenreTags;
