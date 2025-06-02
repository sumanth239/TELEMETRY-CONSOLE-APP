// deafult imports
import React from 'react';

//style sheet imports
import './TelecommandInfo.css';

//utilities import
import * as types from '../Utils/types';


const TelecommandInfo: React.FC = () => {
  const allLabels: types.CommandLabel[] = [
    { 
      label: "System Mode", 
      units: "", 
      description: "Controls the operational state of the system. In Safe mode, all potentially harmful operations are disabled."
    },
    { 
      label: "PAT Mode", 
      units: "", 
      description: "Pointing, Acquisition and Tracking system status. Controls the laser targeting subsystem."
    },
    { 
      label: "Azimuth Angle", 
      units: "deg", 
      description: "Horizontal angle of the gimbal system. Used for coarse pointing in the initial acquisition phase."
    },
    { 
      label: "Elevation Angle", 
      units: "deg", 
      description: "Vertical angle of the gimbal system. Limited by mechanical constraints of the mounting system."
    },
    { 
      label: "Motor Current Consumption", 
      units: "A", 
      description: "Current draw of the gimbal motor system. Values above 4A trigger automatic safety shutdown."
    },
    { 
      label: "ODT Temperature", 
      units: "°C", 
      description: "Operating temperature of the Optical Data Terminal. Thermal management activates at temperatures exceeding 45°C."
    },
    { 
      label: "Gimbal Temperature", 
      units: "°C", 
      description: "Temperature of the mechanical gimbal system. Critical for maintaining pointing accuracy in varying thermal conditions."
    },
    { 
      label: "Quadcell Channel 1", 
      units: "", 
      description: "Upper-left quadrant signal strength from the quadrant detector. Used for fine pointing adjustment of the optical system."
    },
    { 
      label: "Quadcell Channel 2", 
      units: "", 
      description: "Upper-right quadrant signal strength from the quadrant detector. Values are normalized between 0-1."
    },
    { 
      label: "Quadcell Channel 3", 
      units: "", 
      description: "Lower-left quadrant signal strength from the quadrant detector. Balanced readings across all channels indicate proper alignment."
    },
    { 
      label: "Quadcell Channel 4", 
      units: "", 
      description: "Lower-right quadrant signal strength from the quadrant detector. Used together with other channels for determining pointing error."
    },
    { 
      label: "EDFA Mode", 
      units: "", 
      description: "Erbium-Doped Fiber Amplifier operational mode. Controls laser amplification."
    },
    { 
      label: "EDFA Power", 
      units: "W", 
      description: "Output power of the Erbium-Doped Fiber Amplifier. Depends on link distance and atmospheric conditions."
    },
    { 
      label: "EDFA Gain", 
      units: "dB", 
      description: "Gain setting of the optical amplifier. Higher values used for longer distance communication links."
    },
    { 
      label: "EDFA Current", 
      units: "mA", 
      description: "Current consumption of the EDFA pump laser. Provides insight into amplifier efficiency and potential degradation over time."
    },
    { 
      label: "EDFA Alarms", 
      units: "", 
      description: "Status flags for various EDFA subsystem alarms. Bitmask value where each bit represents a specific alarm condition."
    },
    { 
      label: "EDFA Laser Temperature", 
      units: "°C", 
      description: "Operating temperature of the EDFA pump laser. Critical parameter for maintaining wavelength stability."
    },
    { 
      label: "EDFA Internal Temperature", 
      units: "°C", 
      description: "Internal temperature of the EDFA housing. Monitored to prevent thermal damage to sensitive optical components."
    },
    { 
      label: "Beacon Status", 
      units: "", 
      description: "Status of beacon detection. Essential for initial acquisition and maintaining optical link."
    },
    { 
      label: "Beacon Exposure", 
      units: "°C", 
      description: "Exposure level of the beacon detector. Adjusted automatically based on ambient light conditions and signal strength."
    },
    { 
      label: "Beacon Sensor Temperature", 
      units: "°C", 
      description: "Operating temperature of the beacon detection sensor. Temperature affects sensitivity and noise characteristics."
    },
    { 
      label: "TEC Laser Temperature", 
      units: "°C", 
      description: "Temperature of the Thermoelectric Cooler for the laser system. Maintains precise wavelength by controlling laser diode temperature."
    },
    { 
      label: "TEC Voltage", 
      units: "V", 
      description: "Operating voltage of the Thermoelectric Cooler. Depends on required cooling or heating power."
    },
    { 
      label: "TEC Current", 
      units: "A", 
      description: "Current draw of the Thermoelectric Cooler. Direction indicates cooling vs. heating mode, magnitude relates to thermal load."
    },
    { 
      label: "ODT 5V Rail", 
      units: "V", 
      description: "Voltage level of the 5V power rail for the Optical Data Terminal. Critical for proper operation of digital logic circuits."
    },
    { 
      label: "SOC 3.3V Rail", 
      units: "V", 
      description: "Voltage level of the 3.3V power rail for the System-on-Chip. Powers the main processing and control components."
    },
    { 
      label: "SOC 1.8V Rail", 
      units: "V", 
      description: "Voltage level of the 1.8V power rail for the System-on-Chip. Used for memory interfaces and peripheral components."
    },
    { 
      label: "SOC 1.35V Rail", 
      units: "V", 
      description: "Voltage level of the 1.35V power rail for the System-on-Chip. Powers core CPU functionality and high-speed interfaces."
    },
    { 
      label: "SOC 1V Rail", 
      units: "V", 
      description: "Voltage level of the 1V power rail for the System-on-Chip. Critical for processor core operation at high frequencies."
    },
    { 
      label: "SOC Temperature", 
      units: "°C", 
      description: "Operating temperature of the System-on-Chip. Performance throttling begins at 85°C and emergency shutdown at 105°C."
    }
  ];

  return (
    <div className="telecommand-container">
      <div className="main-content">
        <h1 className="page-title">Telecommands Information</h1>

        <div className="telecommand-card">
          <div className="command-list">
            {allLabels.map((item, index) => (
              <section key={index} className="command-section">
                <h2>{item.label} {item.units && <span className="units">({item.units})</span>}</h2>
                <p className="description">{item.description}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelecommandInfo;