import { useState } from 'react'
import './App.css'
import { MantineProvider, Text } from '@mantine/core';

function App() {
  const [count, setCount] = useState(0)

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Text>Welcome to Mantine!</Text>
    </MantineProvider>
  )
}

export default App
