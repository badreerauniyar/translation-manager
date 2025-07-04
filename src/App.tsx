import { Route, Routes } from 'react-router-dom'
import './App.css'
import {LanuageMangement} from './pages/languageManagement/languageManagement'
import { LanguageSelection } from './pages/languageSelection/languageSelection'

function App() {

  return (
    <>
     <div>
      <Routes>
        <Route path="" element={<LanguageSelection/>} />
         <Route path="languagemanagement" element={<LanuageMangement/>} />
      </Routes>
    </div>
    </>
  )
}

export default App
