import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import Header from "./Components/Header";
import HomePage from './Pages/HomePage';


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
