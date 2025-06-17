// SettingsScreen.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';
import "./SettingScreen.css";
import Swal from 'sweetalert2';
import Select from 'react-select';
import moment from 'moment-timezone';
import * as helperFunctions from '../Utils/HelperFunctions';

// Types
interface SettingsContextType {
  timezone: string;
  setTimezone: (tz: string) => void;
  frequency: number;
  setFrequency: (freq: number) => void;
}
interface TimezoneOption {
  label: React.ReactNode; // Previously was string
  value: string;
  searchable: string;
}


// Generate timezone options in required format
const timezoneOptions: TimezoneOption[] = moment.tz.names().map((tz) => {
  const offset = moment.tz(tz).utcOffset();
  const abbr = moment.tz(tz).format('z');
  const sign = offset >= 0 ? '+' : '-';
  const hours = Math.floor(Math.abs(offset) / 60).toString().padStart(2, '0');
  const minutes = (Math.abs(offset) % 60).toString().padStart(2, '0');
  const city = tz.split('/').pop()?.replace(/_/g, ' ') ?? tz;

  return {
    value: tz,
    searchable: `${city} ${abbr} ${tz}`.toLowerCase(),
    label: (
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <span>{city}, {abbr}</span>
        <span style={{ whiteSpace: 'nowrap', marginLeft: '1rem' ,color:'white',backgroundColor:'grey',opacity:"0.7",padding:'2px 5px',borderRadius:"5px",fontWeight:"bolder"}}>
          UTC{sign}{hours}:{minutes} UTC
        </span>
      </div>
    )
  };
});

// Context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [timezone, setTimezone] = useState<string>(
    timezoneOptions[0].value
  );
  const [frequency, setFrequency] = useState<number>(1);

  return (
    <SettingsContext.Provider value={{ timezone, setTimezone, frequency, setFrequency }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};

// Main Settings Screen
const SettingsScreen = () => {
  const { timezone, setTimezone, frequency, setFrequency } = useSettings();

  const [localTimezone, setLocalTimezone] = useState<TimezoneOption>(
    timezoneOptions.find((tz) => tz.value === timezone) || timezoneOptions[0]
  );
  const [localFrequency, setLocalFrequency] = useState<number>(frequency);

  const handleSave = () => {
    setTimezone(localTimezone.value);
    setFrequency(localFrequency);

    Swal.fire({
      text: "Settings saved successfully!",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });

    helperFunctions.updateSessionLogs(
      `updated settings : Timezone - ${localTimezone.value}, Frequency - ${localFrequency * 100}ms`
    );
  };

  return (
    <div className="settings-page">
      <div className="settings-wrapper">
        <div className="settings-header">
          <h1 className="settings-title">Application Settings</h1>
          <p className="settings-subtitle">Configure your preferences</p>
        </div>

        <div className="settings-container">
          {/* Timezone */}
          <div className="card">
            <div className="card-content">
              <label className="label">Select Timezone</label>
              <div className="select-container">
                <Select
                  options={timezoneOptions}
                  value={localTimezone}
                  onChange={(option) => {
                    if (option) setLocalTimezone(option);
                  }}
                  classNamePrefix="select"
                  filterOption={(option, inputValue) => {
                    const searchable = (option.data.searchable || '').toLowerCase();
                    return searchable.includes(inputValue.toLowerCase());
                  }}
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      borderRadius: '8px',
                      border: '2px solid #d1d5db',
                      backgroundColor: '#ffffff',
                      color: '#1e293b',
                      fontSize: '1rem',
                      fontWeight: 500,
                      boxShadow: state.isFocused ? '0 0 0 3px rgba(99, 102, 241, 0.1)' : 'none',
                      '&:hover': {
                        borderColor: '#9ca3af',
                      },
                    }),
                    menu: (base) => ({
                      ...base,
                      borderRadius: '8px',
                      zIndex: 10,
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? '#e0e7ff' : '#fff',
                      color: '#1e293b',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: '#1e293b',
                    }),
                    dropdownIndicator: (base) => ({
                      ...base,
                      color: '#6b7280',
                    }),
                  }}
                />
              </div>
            </div>
          </div>

          {/* Frequency */}
          <div className="card">
            <div className="card-content">
              <label className="label">Select Frequency</label>
              <div className="select-container">
                <select
                  value={localFrequency}
                  onChange={(e) => setLocalFrequency(Number(e.target.value))}
                  className="select"
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {(i + 1) * 100}ms
                    </option>
                  ))}
                </select>
                <i className="bi bi-chevron-down select-icon"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="save-section">
          <button className="save-button" onClick={handleSave}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
