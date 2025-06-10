import './App.css';
import Dashboard from './Dashboard/DashBoard';
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DataViewer from './DataViewer/DataViewer';
import Layout from './HeaderLayout/layout';
import SignIn from './SignIn/SignIn';
import SignUp from './SignUp/SignUp';
import TelecommandInfo from './HelpScreen/TelecommandInfo';
import SettingsScreen, { SettingsProvider } from './SettingsSceen/SettingScreen';
import SignOut from './SignOut/SignOut';

function App() {
  return (
    <SettingsProvider>
      <Router>
        <Routes>
          {/* Exact match for SignIn */}
          <Route path='/' element={<SignIn />} />

          {/* Layout wrapper for authenticated routes */}
          <Route path='/' element={<Layout />}>
            <Route path='dashboard' element={<Dashboard />} />
            <Route path='data-viewer' element={<DataViewer />} />
            <Route path='signup' element={<SignUp />} />
            <Route path='help' element={<TelecommandInfo />} />
            <Route path='settings' element={<SettingsScreen />} />
            <Route path='signin' element={<SignIn />} />
            <Route path='signout' element={<SignOut />} />
          </Route>
        </Routes>
      </Router>
    </SettingsProvider>


  );
}

export default App;
