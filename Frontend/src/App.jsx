import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SignIn from './pages/PrimaryPages/SignIn'
import SignUp from './pages/PrimaryPages/SignUp'
import Homepage from './pages/Homepage'
import ConfirmOTP from './pages/ConfirmOTP'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} index />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signup/confirmOTP" element={<ConfirmOTP />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
