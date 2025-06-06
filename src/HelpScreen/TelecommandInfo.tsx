// Deafult imports
import React from 'react';

//Style sheet imports
import './TelecommandInfo.css';

//Utilities import
import * as CONSTANTS from '../Utils/Constants';


const TelecommandInfo: React.FC = () => {
  

  return (
    <div className="telecommand-container">
      <div className="main-content">
        <h1 className="page-title">Telecommands Information</h1>

        <div className="telecommand-card">
          <div className="command-list">
            {CONSTANTS.TELE_COMMANDS_INFO.map((item, index) => (
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