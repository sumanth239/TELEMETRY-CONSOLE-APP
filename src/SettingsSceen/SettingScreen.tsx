import React, { createContext, useContext, useState, ReactNode } from 'react';
import "./SettingScreen.css";
import Swal from 'sweetalert2';

// 1. Context Definition (not used in this file)
interface SettingsContextType {
    timezone: string;
    setTimezone: (tz: string) => void;
    frequency: number;
    setFrequency: (freq: number) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
    const [timezone, setTimezone] = useState<string>('UTC');
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

const timezones = [
    'UTC', 'IST', 'PST', 'EST', 'CST', 'MST', 'GMT', 'CET', 'EET', 'JST', 'AEST'
];

const frequencies = Array.from({ length: 10 }, (_, i) => `${(i + 1) * 100}ms`);

const SettingsScreen = () => {
    const { timezone, setTimezone, frequency, setFrequency } = useSettings();

    // Step 1: Local state for form inputs, initialized with context values
    const [localTimezone, setLocalTimezone] = useState<string>(timezone);
    const [localFrequency, setLocalFrequency] = useState<number>(frequency);

    // Step 2: Save local values to context only when Save is clicked
    const handleSave = () => {
        setTimezone(localTimezone);
        setFrequency(localFrequency);

        console.log('Settings saved:', { timezone: localTimezone, frequency: localFrequency });

        Swal.fire({
            title: "Great job!",
            text: "Settings saved successfully!",
            icon: "success"
        });
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
                                <select
                                    value={localTimezone}
                                    onChange={(e) => setLocalTimezone(e.target.value)}
                                    className="select"
                                >
                                    {timezones.map((tz) => (
                                        <option key={tz} value={tz}>{tz}</option>
                                    ))}
                                </select>
                                <i className="bi bi-chevron-down select-icon"></i>
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

                {/* Save Button */}
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
