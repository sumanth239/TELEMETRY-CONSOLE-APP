import { useEffect } from 'react';
import axios from 'axios';
import * as helperFunctions from "../Utils/HelperFunctions" // adjust the path as needed

const useTelecommandPolling = (setTmtData: (data: any[]) => void) => {
  useEffect(() => {
    const interval = setInterval(() => {
      const loginedTime = helperFunctions.getSessionStorageKey("loginTime") || new Date().toISOString();

      axios
        .get('/telecommands', { params: { from_time: loginedTime } })
        .then(res => {
          console.log('Fetched telecommands:', res.data);
          setTmtData(res.data);
        })
        .catch(err => {
          console.error('Error fetching telecommands:', err);
        });
    }, 2000);

    return () => clearInterval(interval);
  }, [setTmtData]);
};

export default useTelecommandPolling;
