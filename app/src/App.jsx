import { Routes, Route } from 'react-router-dom';
import './styling/App.css'
import Home from './Pages/Home';
import Deploy from './Pages/Deploy';
import JoinPool from './Pages/JoinPool';
import PoolManagement from './Pages/PoolManagement';
import Standings from './Pages/Standings';
import MyBrackets from './Pages/MyBrackets';

function App() {

  return (
    <>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/Deploy' element={<Deploy />} />
      <Route path='/JoinPool/:poolAddress' element={<JoinPool />} />
      <Route path='/PoolManagement/:poolAddress' element={<PoolManagement />} />
      <Route path='/Standings/:poolAddress' element={<Standings />} />
      <Route path='/MyBrackets/:poolAddress' element={<MyBrackets />} />
    </Routes>
    </>
  );
}

export default App;