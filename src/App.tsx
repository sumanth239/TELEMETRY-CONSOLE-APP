import './App.css';
import Dashboard from './Dashboard/DashBoard';
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter as Router ,Route,Routes } from 'react-router-dom';
import DataViewer from './DataViewer/DataViewer';
import Layout from './HeaderLayout/layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />} >
          <Route path='/dashboard' element={<Dashboard />}/>
          <Route path='/data-viewer' element={<DataViewer />}/>
          {/* <Route path='/title2' element={<BarGraphChart />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
