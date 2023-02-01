import './App.css'
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path={'/'} element={<p>123123</p>}/>
      <Route path={'/123'} element={<p>asdasd</p>}/>
    </Routes>
  )
}

export default App
