import { useState, useEffect } from 'react'
import { Grid2 } from '@mui/material'
import { toast } from 'react-toastify'
import CustomHead from '@/utils/CustomHead'

const Home = () => {
  return (
    <>
    <CustomHead title="Home" />
    <Grid2>
      <h1>Home</h1>
    </Grid2>
    </>
  )
}

export default Home