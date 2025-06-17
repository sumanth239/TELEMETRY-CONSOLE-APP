//default imports
import React from 'react';
import { useEffect, useState } from 'react';

//style sheet imports
import "./TimeTagCmdsList.css"

//library imports
import axios from "axios";

//components imports
import NoDataFound from '../../NoData/NoData';
import { confirmAction } from './ConfirmAction';

// utility imports
import * as helperFunctions from "../../Utils/HelperFunctions";
import * as CONSTANTS from "../../Utils/Constants";
import { useDashboardStore } from '../../Store/useDashboardStore';

interface ScheduledCommandsProps {
    onClose: () => void;
}

const TimeTagCommandsList: React.FC<ScheduledCommandsProps> = ({ onClose }) => {
    const { scheduledTimeTagCmds, setScheduledTimeTagCmds } = useDashboardStore();

    const submitHandler = async () => {
        confirmAction({
            title: 'Send Scheduled Commands?',
            text: 'Are you sure you want to send all scheduled Time Tag commands now?',
            confirmButtonText: 'Send',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#20409A',
            cancelButtonColor: '#e53e3e',
            allowOutsideClick: false,
            onConfirm: async () => {
                for (const item of scheduledTimeTagCmds) {
                    try {
                        const teleCmdValues = item.values.map((val) => Number(val));
                        await axios.post(CONSTANTS.POST_TELECOMMABD_API_URL, {
                            telecmd_id: Number(item.id),
                            telecmd: item.command,
                            telecmd_value: teleCmdValues,
                            apid: CONSTANTS.TIMETAG_CMD_APID,
                            timestamp: item.timeStamp,
                        }, {
                            headers: {
                                "Accept": "application/json",
                                "Content-Type": "application/json",
                            },
                        });

                        helperFunctions.updateSessionLogs(
                            `Sent ${item.command} scheduled at ${item?.timeStamp && helperFunctions.formatDateToReadableString(item?.timeStamp)}`
                        );
                        setScheduledTimeTagCmds([]);
                    } catch (error) {
                        console.error("FAILED to send telecommand:", error);
                        helperFunctions.updateSessionLogs(`Failed to send ${item.command}: ${error}`);
                    }
                }

                helperFunctions.updateSessionLogs("Sent all scheduled Time Tag commands.");
            },
            onCancel: () => {
                helperFunctions.updateSessionLogs("User cancelled sending scheduled Time Tag commands.");
            }
        });


    };



    return (
        <div className='scheduled-cmd-overlay-container'
            onClick={(e) => {               // Ensure the click is on the overlay and not on the scheduled-cmds container
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className='scheduled-cmds-main-container'>
                <div className='scheduled-cmds-header-container'>
                    <p>SCHEDULED TIME TAG COMMANDS LIST </p>
                </div>

                
                    {helperFunctions.isArrayEmpty(scheduledTimeTagCmds) ? (
                        <NoDataFound message={CONSTANTS.NO_SCHEDULED_COMMANDS} />
                    ) : (
                        <div className="scheduled-cmds-container">
                        <div className="scheduled-cmds-table">
                            {/* Table Header */}
                            <div className="scheduled-cmds-row header">
                                <span>ID</span>
                                <span>Command</span>
                                <span>Values</span>
                                <span>Scheduled Time</span>
                                <span>Action</span>
                            </div>

                            {/* Table Rows */}
                            {scheduledTimeTagCmds.map((item, index) => (
                                <div className="scheduled-cmds-row" key={index}>
                                    <span>{item.id}</span>
                                    <span>{item.command}</span>
                                    <span>
                                        {!helperFunctions.isArrayEmpty(item.values) &&
                                            item.values.map((value: number, idx: number) => (
                                                <span key={idx}>
                                                    {helperFunctions.resolveLabelValue(item.command, value)}
                                                    {idx < item.values.length - 1 && ', '}
                                                </span>
                                            ))}
                                    </span>

                                    <span className="scheduled-cmd-timestamp">
                                        {item?.timeStamp && helperFunctions.formatDateToReadableString(item.timeStamp)}
                                    </span>
                                    <button
                                        className="action-button"
                                        onClick={() => {
                                            helperFunctions.updateSessionLogs(
                                                `Removed ${item.command} Time Tag command scheduled at ${item?.timeStamp && helperFunctions.formatDateToReadableString(
                                                    item.timeStamp
                                                )}`
                                            );

                                            // Remove from store
                                            setScheduledTimeTagCmds((prev) => prev.filter((_, i) => i !== index));
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                        </div>
                    )}
               
                {!helperFunctions.isArrayEmpty(scheduledTimeTagCmds) &&
                    <div className="scheduled-cmds-footer">
                        <button className="send-button" onClick={() => {
                            submitHandler();
                            helperFunctions.updateSessionLogs("Sent all scheduled Time Tag commands.");
                        }}>
                            Send
                        </button>
                    </div>
                }


            </div>
        </div>
    );
};

export default TimeTagCommandsList;
