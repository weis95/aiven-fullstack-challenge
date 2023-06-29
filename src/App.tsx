import axios from 'axios'
import { Box } from 'components/Box.styled'
import { GridContainer } from 'components/GridContainer.styled'
import React, { useEffect, useState } from 'react'

import './App.css'

interface Data {
  provider: string
  name: string
  distance: number
}

function App() {
  const [loading, setLoading] = useState<boolean>(true)
  const [data, setData] = useState<Data[]>([])
  const [providers, setProviders] = useState<string[]>([])
  const [error, setError] = useState<string>('')
  const [selectProvider, setSelectProvider] = useState<string>('All')

  /* 
    Better to order in the BE, genrally. But to demonstrate a bit more JS, I'll do it here. 
    Could also have been numbers or a boolean and just automatically order by distance. 
  */
  const [selectDistance, setSelectDistance] = useState<string>('Order By')

  const geolocationAPI = navigator.geolocation

  const getUserCoordinates = () => {
    /* 
      https://www.abstractapi.com/guides/how-to-use-ip-geolocation-in-react 
    */

    if (!geolocationAPI) {
      setError('Geolocation API is not available in your browser!')
    } else {
      geolocationAPI.getCurrentPosition(
        (position) => {
          const { coords } = position
          getClouds(coords.latitude, coords.longitude)
        },
        () => {
          setError('Something went wrong getting your position!')
        }
      )
    }
  }

  const getClouds = (latitude: number, longitude: number) => {
    axios
      .post('http://127.0.0.1:5000/clouds', {
        lat: latitude,
        lon: longitude,
        provider: selectProvider !== 'All' ? selectProvider : null
      })
      .then((res) => {
        setData(res.data.clouds)
        setProviders(res.data.providers)

        /* 
          Resetting sort order isn't very user friendly.
        */
        setSelectDistance('Order By')
        setLoading(false)
      })
  }

  const onProviderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setLoading(true)
    setSelectProvider(value)
  }

  const onDistanceSortingChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value
    setSelectDistance(value)

    const arr =
      value === 'Asc'
        ? data.sort((a, b) => (a.distance > b.distance ? 1 : -1))
        : data.sort((a, b) => (a.distance < b.distance ? 1 : -1))

    setData(arr)
  }

  useEffect(() => {
    getUserCoordinates()
  }, [selectProvider])

  return (
    <div className="App" style={{ padding: '10px' }}>
      <Box justify="center" direction="column">
        <h1>Clouds</h1>
        {error ? (
          <p>{error}</p>
        ) : loading ? (
          <p>loading...</p>
        ) : (
          <>
            <GridContainer>
              <Box>
                <p>Name</p>
              </Box>
              <Box direction="column" align="start">
                <p>Provider</p>
                <Box padding="0 0 10px 0">
                  <select value={selectProvider} onChange={onProviderChange}>
                    <option>All</option>
                    {providers.map((item, index) => (
                      <option key={index}>{item}</option>
                    ))}
                  </select>
                </Box>
              </Box>
              <Box direction="column" align="start">
                <p>Distance</p>
                <Box padding="0 0 10px 0">
                  <select
                    value={selectDistance}
                    onChange={onDistanceSortingChange}
                  >
                    {selectDistance === 'Order By' && <option>Order By</option>}
                    <option>Desc</option>
                    <option>Asc</option>
                  </select>
                </Box>
              </Box>
            </GridContainer>
            {data.map((item, index) => {
              const { name, distance, provider } = item

              return (
                <GridContainer key={index}>
                  <Box>{name}</Box>
                  <Box>{provider}</Box>
                  <Box>{`${distance} KM`}</Box>
                </GridContainer>
              )
            })}
          </>
        )}
      </Box>
    </div>
  )
}

export default App
