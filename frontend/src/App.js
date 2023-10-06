
import { BrowserRouter as Router , Routes , Route } from 'react-router-dom';
import Tiktactoe from './Pages/tik-tak-toe';
import Snake from './Pages/snake-ladder';
import Home from './Pages/home';
import Login from './Pages/login';

import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/tik-tak-toe" element={<Tiktactoe/>}/>
          <Route path="/snake-and-ladder" element={<Snake/>}/>
          <Route path="/login" element={<Login/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
