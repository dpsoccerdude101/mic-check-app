import { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { Autocomplete, Grid, TextField, makeStyles } from '@material-ui/core';
import PropTypes from 'prop-types';
import api from 'src/utils/api';
import type { BaseResponse } from 'src/types';
import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles(
  {
    address: {
      cursor: 'pointer',
      padding: 10
    },
    icon: {
      display: 'inline-block',
      width: 40,
      height: 24,
      color: '#aaaaaa'
    },
    description: {
      fontSize: 'small',
      marginLeft: 10,
      color: 'rgba(0,0,0,.6)'
    },
  }
);

type CustomAutocompleteProps = {
  allowOnlyInput?: boolean;
  Icon?: any;
  descriptionLabel: string;
  formatValue?: (value: any) => string;
  optionLabel: string;
  primaryLabel: string;
  setValue: (selected: any) => void;
  routeFunction: (text: string) => string;
  value: any;
};

const CustomAutocomplete = <T,>({ allowOnlyInput = false, Icon, formatValue, optionLabel, primaryLabel, descriptionLabel, routeFunction, setValue, value }: CustomAutocompleteProps): JSX.Element => {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<T[]>([]);

  const getOptionsDelayed = useCallback(
    debounce(async (text, callback) => {
      setOptions([]);
      if (text && text.length > 3) {
        const response: BaseResponse<T[]> = await api.get(routeFunction(text));
        const { data, success } = response;
        if (success) {
          callback(data);
        }
      }
    }, 300),
    []
  );

  useEffect(() => {
    getOptionsDelayed(inputValue, (filteredOptions) => {
      setOptions(filteredOptions);
    });
  }, [inputValue, getOptionsDelayed]);

  const renderOption = (option: T) => (
    <Grid
      onClick={() => {
        setOpen(false);
        setValue(option);
      }}
      className={classes.address}
      key={option[optionLabel]}
      container
      alignItems='center'
    >
      <Grid item>
        {Icon && <Icon className={classes.icon} />}
      </Grid>
      <Grid item xs>
        <span>{option[primaryLabel]}</span>
        {descriptionLabel && <span className={classes.description}>{option[descriptionLabel]}</span>}
      </Grid>
    </Grid>
  );

  return (
    <Autocomplete
      id={`autocomplete-${uuidv4()}`}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      filterOptions={(x) => x}
      autoComplete
      value={value === null ? '' : value}
      getOptionLabel={(option) => {
        if (typeof (option) === 'string') { return option; }

        if (formatValue) {
          return formatValue(option);
        }
        return option[optionLabel];
      }}
      isOptionEqualToValue={(option, selected) => option[optionLabel] === selected[optionLabel]}
      onInputChange={(_, newValue) => { setInputValue(newValue); }}
      renderOption={(props, option: T) => {
        if (typeof (option) === 'string') {
          const parsedOption: any = {
            [descriptionLabel]: '',
            [optionLabel]: option,
            [primaryLabel]: option
          };
          return renderOption(parsedOption);
        }

        return renderOption(option);
      }}
      options={
        (inputValue && allowOnlyInput
          ? [inputValue, ...options]
          : options)
      }
      loading={inputValue.length > 2 && options.length === 0}
      renderInput={(params) => (
        <TextField
          {...params}
          variant='outlined'
          fullWidth
        />
      )}
    />
  );
};

CustomAutocomplete.propTypes = {
  Icon: PropTypes.any,
  descriptionLabel: PropTypes.string,
  formatValue: PropTypes.func,
  optionLabel: PropTypes.string.isRequired,
  routeFunction: PropTypes.func.isRequired,
  setValue: PropTypes.func.isRequired,
  value: PropTypes.object
};

export default CustomAutocomplete;
