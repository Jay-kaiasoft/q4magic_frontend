import React, { useEffect, useState } from 'react'
import { deleteAccount, getAllAccounts } from '../service/account/accountService';
import AccountModel from '../models/accountModel';
import { connect } from 'react-redux';
import { setAlert, setLoading } from '../redux/commonReducers/commonReducers';
import { syncToQ4Magic } from '../service/salesforce/syncToQ4Magic/syncToQ4MagicService';
import { syncFromQ4magic } from '../service/salesforce/syncFromQ4magic/syncFromQ4magicService';
import { getAllSyncRecords } from '../service/syncRecords/syncRecordsService';
import Badge from '@mui/material/Badge';
const Account = ({ setAlert, setLoading }) => {
    const [accounts, setAccounts] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedAccountId, setSelectedAccountId] = useState(null);
    // const [loading, setLoading] = useState(false);
    const [syncRecords, setSyncRecords] = useState([]);

    const handleOpen = (accountId = null) => {
        setSelectedAccountId(accountId);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleGetAllAccounts = async () => {
        setLoading(true);
        try {
            const accRes = await getAllAccounts();
            if (accRes?.status === 200) {
                setAccounts(accRes.result || []);
                handleGetAllSyncRecords();
                setLoading(false);
            }
        } catch (err) {
            setAlert({
                open: true,
                message: err.message || "Error fetching Salesforce data.",
                type: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        setLoading(true);
        try {
            const res = await syncToQ4Magic();
            if (res?.status === 200) {
                handlePushAccounts();
            } else {
                setLoading(false);
                setAlert({
                    open: true,
                    message: res?.message || "Failed to sync accounts",
                    type: "error"
                })
            }
        } catch (err) {
            setLoading(false);
            setAlert({
                open: true,
                message: err.message || "Error syncing accounts to Q4Magic.",
                type: "error"
            })
        }
    }

    const handlePushAccounts = async () => {
        setLoading(true);
        try {
            const res = await syncFromQ4magic();
            if (res?.status === 200) {
                setLoading(false);
                setAlert({
                    open: true,
                    message: res?.message || "Accounts synced successfully",
                    type: "success"
                })
                handleGetAllAccounts();
            } else {
                setLoading(false);
                setAlert({
                    open: true,
                    message: res?.message || "Failed to sync accounts",
                    type: "error"
                })
            }
        } catch (err) {
            setLoading(false);
            setAlert({
                open: true,
                message: err.message || "Error syncing accounts to Q4Magic.",
                type: "error"
            })
        }
    }

    const handleDeleteAccount = async (accountId) => {
        const res = await deleteAccount(accountId);
        if (res.status === 200) {
            setAlert({
                open: true,
                message: "Account deleted successfully",
                type: "success"
            });
            handleGetAllAccounts();
        } else {
            setAlert({
                open: true,
                message: res?.message || "Failed to delete account",
                type: "error"
            });
        }
    }

    const handleGetAllSyncRecords = async () => {
        try {
            const syncRecords = await getAllSyncRecords();
            if (syncRecords?.status === 200) {
                setSyncRecords(syncRecords.result || []);
            }
        } catch (error) {
            setAlert({
                open: true,
                message: error.message || "Error fetching sync records.",
                type: "error"
            });
        }
    }

    useEffect(() => {
        handleGetAllAccounts();
        handleGetAllSyncRecords();
    }, []);

    return (
        <div className='px-4'>
            {/* {!loading && (
                <div className="absolute inset-0 flex justify-center items-center h-screen bg-gray-200 w-screen opacity-50">
                    <p>Loading...</p>
                </div>
            )} */}
            <div className='flex justify-start items-center space-x-2 mb-4'>
                <button onClick={() => handleOpen()} className="bg-purple-700 text-white p-2 rounded">Add New Account</button>
                <Badge badgeContent={syncRecords?.length || 0} color="error">
                    <div>
                        <button
                            onClick={handleSync}
                            className="bg-green-500 text-white p-2 rounded"
                        >
                            SYNC
                        </button>
                    </div>
                </Badge>

            </div>

            <table className="table-auto border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border p-2">Id</th>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts?.map((acc, index) => (
                        <tr key={index}>
                            <td className="border p-2">{acc.salesforceAccountId}</td>
                            <td className="border p-2">{acc.accountName}</td>
                            <td className="border p-2">{acc.phone}</td>
                            <td className="border p-2 flex justify-center items-center space-x-2">
                                <button
                                    onClick={() => handleOpen(acc.id)}
                                    className="bg-blue-500 text-white p-1 rounded"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => handleDeleteAccount(acc.id)}
                                    className="bg-red-500 text-white p-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <AccountModel open={open} handleClose={handleClose} accountId={selectedAccountId} handleGetAllAccounts={handleGetAllAccounts} handleGetAllSyncRecords={handleGetAllSyncRecords} />
        </div>
    )
}

const mapDispatchToProps = {
    setAlert,
    setLoading,
};

export default connect(null, mapDispatchToProps)(Account)