import React, { useEffect, useState } from 'react'
import { getAllAccounts } from '../service/account/accountService';
import AccountModel from '../models/accountModel';
import { connect } from 'react-redux';
import { setAlert } from '../redux/commonReducers/commonReducers';
import { syncAccountsToQ4Magic } from '../service/salesforce/syncToQ4Magic/syncToQ4MagicService';
import { syncAccountsFromQ4Magic } from '../service/salesforce/syncFromQ4magic/syncFromQ4magicService';

const Account = ({ setAlert }) => {
    const [accounts, setAccounts] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedAccountId, setSelectedAccountId] = useState(null);
    const [loading, setLoading] = useState(false);

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

    const handleSyncAccounts = async () => {
        setLoading(true);
        try {
            const res = await syncAccountsToQ4Magic();
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

    const handlePushAccounts = async () => {
        setLoading(true);
        try {
            const res = await syncAccountsFromQ4Magic();
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

    useEffect(() => {
        handleGetAllAccounts();
    }, []);

    return (
        <div className='px-4'>
            {loading && (
                <div className="flex justify-center items-center absolute h-screen bg-gray-200 w-screen opacity-50">
                    <p>Loading...</p>
                </div>
            )}
            <div className='flex justify-start items-center space-x-2 mb-4'>
                <button onClick={() => handleOpen()} className="bg-purple-700 text-white p-2 rounded">Add New Account</button>
                <button onClick={handleSyncAccounts} className="bg-green-500 text-white p-2 rounded">Pull From Salesforce</button>
                <button onClick={handlePushAccounts} className="bg-gray-500 text-white p-2 rounded">Push to Salesforce</button>
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
                    {accounts.map((acc) => (
                        <tr key={acc.Id}>
                            <td className="border p-2">{acc.salesforceAccountId}</td>
                            <td className="border p-2">{acc.accountName}</td>
                            <td className="border p-2">{acc.phone}</td>
                            <td className="border p-2 flex justify-center items-center space-x-2">
                                <button
                                    onClick={() => handleOpen(acc.id)}
                                    className="bg-red-500 text-white p-1 rounded"
                                >
                                    Update account
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <AccountModel open={open} handleClose={handleClose} accountId={selectedAccountId} handleGetAllAccounts={handleGetAllAccounts} />
        </div>
    )
}

const mapDispatchToProps = {
    setAlert,
};

export default connect(null, mapDispatchToProps)(Account)