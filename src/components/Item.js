import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles';

export const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    height: '80vh',
    display: 'flex',
    flexFlow: 'column' || 'nowrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: '4rem',
    padding: '2rem',
    marginX: 0
}));

export default Item;