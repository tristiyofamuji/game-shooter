import { useState } from 'react'
import {BrowserRouter,Routes, Route} from 'react-router-dom'
import './App.css'
import Welcome from './comp/Welcome'
import PlayGame from './comp/PlayGame'

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome/>}/>
        <Route path="/Play" element={<PlayGame/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
