import { createTheme } from '@material-ui/core/styles';
import Colors from 'src/constants/colors';

const defaultTheme = createTheme();

// Create a theme instance.
const theme = createTheme({
  components: {
    MuiAvatar: {
      styleOverrides: {
        fallback: {
          height: '75%',
          width: '75%'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#FFF'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: Colors.PRIMARY,
          color: '#FFFFFF'
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontFamily: 'acumin-pro',
          fontSize: '0.75rem',
          fontWeight: 500,
          // width: '100%',
          whiteSpace: 'nowrap'
        }
      }
    },
    MuiCardHeader: {
      defaultProps: {
        titleTypographyProps: {
          variant: 'h6'
        }
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          width: '100%'
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: 0
        }
      }
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 3,
          overflow: 'hidden'
        }
      }
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 'auto',
          marginRight: '16px'
        }
      }
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          border: 'none',
          color: Colors.COLOR_5,
          fontSize: 15,
          fontFamily: 'sofia-pro',
          fontWeight: 300,
          height: 40,
          paddingLeft: 20,
          paddingRight: 20,
          paddingBottom: 16,
          textTransform: 'none',
          '&.Mui-selected': {
            background: Colors.TERTIARY,
            borderRadius: 5,
            color: 'white',
            fontWeight: 600,
            borderTopLeftRadius: '5px !important',
            borderTopRightRadius: '5px !important',
            borderBottomLeftRadius: '5px !important',
            borderBottomRightRadius: '5px !important',
            '&:hover': {
              background: Colors.TERTIARY
            }
          }
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          borderBottomLeftRadius: 'inherit !important',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          textTransform: 'none'
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'acumin-pro',
          lineHeight: 1,
          letterSpacing: 'normal',
          fontSize: '0.875rem'
        },
        h1: {
          fontSize: 28,
          fontFamily: 'soleil',
          fontWeight: 800,
          color: '#11142D'
        },
        h2: {
          fontFamily: 'soleil',
          fontWeight: 700,
          fontSize: '1rem',
          lineHeight: '1.2rem',
          color: '#11142D'
        },
        h3: {
          fontFamily: 'soleil',
          fontWeight: 600,
          fontSize: '0.875rem',
          lineHeight: '1.2rem',
          color: '#11142D'
        },
        h6: {
          fontFamily: 'acumin-pro',
          fontWeight: 300,
          fontSize: '0.85rem',
          lineHeight: '1.2rem'
        },
        body1: {
          fontSize: 16,
          fontWeight: 400,
          color: Colors.COLOR_6
        },
        body2: {
          color: '#808191',
          fontWeight: 500,
        },
        subtitle1: {
          [defaultTheme.breakpoints.down('md')]: {
            fontSize: '.85rem',
            fontFamily: 'acumin-pro',
            marginTop: 10,
          fontWeight: 300,
          }
        }
      }
    }
  },
  palette: {
    action: {
      active: '#6b778c'
    },
    background: {
      default: '#fff',
      paper: '#ffffff'
    },
    error: {
      contrastText: '#ffffff',
      main: '#f44336'
    },
    mode: 'light',
    primary: {
      contrastText: '#ffffff',
      main: '#172A3A'
    },
    secondary: {
      contrastText: '#11142D',
      main: Colors.SECONDARY
    },
    success: {
      contrastText: '#ffffff',
      main: '#4caf50'
    },
    text: {
      primary: '#172b4d',
      secondary: '#757888',
    },
    warning: {
      contrastText: '#ffffff',
      main: '#ff9800'
    }
  },
  zIndex: {
    snackbar: 9999
  }
});

export default theme;
