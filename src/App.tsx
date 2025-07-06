import { Route, Routes } from 'react-router-dom'
import './App.css'
import {LanuageMangement} from './pages/languageManagement/languageManagement'
import { LanguageSelection } from './pages/languageSelection/languageSelection'
import Projects from './pages/projects/projects'
import Variants from './pages/variants/variants'

function App() {

  return (
    <>
     <div>
      <Routes>
        <Route path="" element={<Projects/>} />
        <Route path="variants/:projectId" element={<Variants/>} />
        <Route path="languageSelection/:projectId:/variantsId" element={<LanguageSelection/>} />
         <Route path="languagemanagement/:projectId:/variantsId/:languageId" element={<LanuageMangement/>} />
      </Routes>
    </div>
    </>
  )
}

export default App
