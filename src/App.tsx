import './App.css';
import Dashboard from './Dashboard/DashBoard';
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DataViewer from './DataViewer/DataViewer';
import Layout from './HeaderLayout/layout';
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';
import TelecommandInfo from './HelpScreen/TelecommandInfo';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/' element={<Layout />} >
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/data-viewer' element={<DataViewer />} />
          <Route path='/signin' element={<SignIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/help' element={<TelecommandInfo />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
