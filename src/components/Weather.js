import React, { useState } from 'react';

import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Item from './Item';

import Spinner from './Spinner';
const cloudLogo = process.env.PUBLIC_URL + '/images/cloud.jpg'
const API_KEY = 'ac698198a0c3c7460519b95e0b968ab7'

export default function Weather() {
    const [coords, setCoords] = useState({ latitude: 0, longitude: 0, place: '' });
    const [loading, setLoading] = useState(false)

    const [weather, setWeather] = useState(null);
    const [bgImage, setBgImage] = useState(cloudLogo)

    const onChange = (e) => {
        setCoords({ ...coords, [e.target.name]: e.target.value })
    }

    const getCountryFullName = async (code) => {
        const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${code}`)
        const result = await response.json()

        return result[0].name.common
    }

    const getCoordinatesFromPlace = async () => {
        const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${coords.place}&limit=5&appid=${API_KEY}`)
        const result = await response.json()

        return [result[0].lat, result[0].lon]
    }

    const kelvinToCelcius = (temp) => {
        return Math.round(temp - 273.15)
    }

    const handleClick = async () => {
        try {
            // If a request is going on, do nothing
            if (loading === true) {
                return;
            }
            setLoading(true)
            setWeather(null)

            let url = '';
            // First priority to name when both latitude and longitude given
            if (coords.place.length !== 0) {
                const [lati, long] = await getCoordinatesFromPlace()
                url = `https://api.openweathermap.org/data/2.5/weather?lat=${lati}&lon=${long}&appid=${API_KEY}`
            }
            else if (coords.latitude && coords.longitude) {
                url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&appid=${API_KEY}`
            }
            else {
                setLoading(false)
                return;
            }

            const response = await fetch(url);
            const result = await response.json();
            const verboseCountry = await getCountryFullName(result.sys.country);

            setWeather({ ...result, verboseCountry })
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error.message)
        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={5}>
                <Grid item xs={12} md={6}>
                    <Item elevation={8} sx={{ marginRight: 0 }}>
                        <Typography component={'h1'} variant={'h5'} sx={{ marginBottom: '0.5rem' }}>Search weather using Latitude & Longitude</Typography>
                        <Stack spacing={2} direction="row">
                            <TextField
                                label="Enter Latitude"
                                name='latitude'
                                variant='standard'
                                onChange={onChange} />
                            <TextField
                                label="Enter Longitude"
                                name='longitude'
                                variant='standard'
                                onChange={onChange} />
                        </Stack>
                        <Typography variant={'h3'}>OR</Typography>
                        <Typography component={'label'} variant={'h5'} sx={{ marginBottom: '0.5rem' }}>Search place directly</Typography>
                        <TextField
                            label="Enter any place"
                            name='place'
                            variant="standard"
                            onChange={onChange}
                        />
                        <Button variant="contained" onClick={handleClick}>Submit</Button>
                    </Item>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Item
                        elevation={4}
                        sx={{
                            marginLeft: 0,
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            backgroundImage: `url(${bgImage})`
                        }}>
                        {loading && <Typography>Loading...</Typography>}
                        {weather && <Stack>
                            <Typography variant='h2'>{kelvinToCelcius(weather.main.temp)}<sup>ᵒ</sup> C</Typography>
                            <Typography variant={'h5'}>
                                {weather.name || 'Unknown'}{weather.verboseCountry ? `, ${weather.verboseCountry}` : ''}
                            </Typography>
                            <Typography>
                                {weather.weather[0].main} : {weather.weather[0].description}
                            </Typography>
                            {weather?.main && <Typography>
                                {kelvinToCelcius(weather.main.temp_max)}<sup>o</sup> / <span>  </span>
                                {kelvinToCelcius(weather.main.temp_min)}<sup>o</sup><span>  </span>
                                Feels like {kelvinToCelcius(weather.main.feels_like)}<sup>o</sup>
                            </Typography>}
                        </Stack>}
                    </Item>
                </Grid>
            </Grid>
        </Box>
    );
}

/*
return (
    <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        flexFlow: 'row' || 'nowrap',
        height: '80vh',
        width: '80vw',
        marginTop: '3rem'
    }}>

        <Card sx={{
            marginLeft: '1rem',
            marginRight: '0.5rem',
            width: '40vw'
        }}>
            <CardContent>
                <Stack spacing={2} direction="column">
                    <TextField
                        label="Enter Latitude"
                        name='latitude'
                        value={coords.latitude}
                        onChange={onChange} />
                    <TextField
                        label="Enter Longitude"
                        name='longitude'
                        value={coords.longitude}
                        onChange={onChange} />
                    <Button variant="contained" onClick={handleClick}>Submit</Button>
                    {weather && <Stack>
                            <Typography>{weather.name} - {weather.sys.country}</Typography>
                            <Typography>{weather.weather[0].main}</Typography>
                            <Typography>{weather.weather[0].description}</Typography>
                        </Stack>}
                </Stack>
            </CardContent>
        </Card>
    </Box>
    );
*/