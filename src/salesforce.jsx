import { useState, useEffect } from "react";
import { connectToSalesforce } from "./service/salesforce/connect/salesforceConnectService";
import { syncAccountsToQ4Magic } from "./service/salesforce/syncToQ4Magic/syncToQ4MagicService";
import { getAllAccounts } from "./service/account/accountService";
import AccountModel from "./models/accountModel";
import { connect } from "react-redux";
import { setAlert } from "./redux/commonReducers/commonReducers";

const Salesforce = ({ setAlert }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [accessToken, setAccessToken] = useState(sessionStorage.getItem("accessToken_salesforce") || "");
    const [instanceUrl, setInstanceUrl] = useState(sessionStorage.getItem("instanceUrl_salesforce") || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [accounts, setAccounts] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedAccountId, setSelectedAccountId] = useState(null);

    const handleOpen = (accountId = null) => {
        setSelectedAccountId(accountId);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await connectToSalesforce();
            if (res?.result?.url) {
                // Open Salesforce login in a popup window
                const width = 600;
                const height = 700;
                const left = window.screenX + (window.outerWidth - width) / 2;
                const top = window.screenY + (window.outerHeight - height) / 2;
                const popup = window.open(
                    res?.result?.url,
                    "Salesforce Login",
                    `width=${width},height=${height},left=${left},top=${top}`
                );

                // Poll the popup until it redirects back
                const popupInterval = setInterval(() => {
                    try {
                        if (!popup || popup.closed) {
                            clearInterval(popupInterval);
                            setLoading(false);
                            return;
                        }
                        // Check if the popup URL contains access_token
                        const popupUrl = popup.location.href;
                        if (popupUrl.includes("access_token=")) {
                            const params = new URLSearchParams(
                                popupUrl.split("#")[1] || popupUrl.split("?")[1]
                            );
                            const token = params.get("access_token");
                            const url = params.get("instance_url");

                            if (token && url) {
                                setAccessToken(token);
                                setInstanceUrl(url);
                                sessionStorage.setItem("accessToken_salesforce", token);
                                sessionStorage.setItem("instanceUrl_salesforce", url);
                                setIsLoggedIn(true);
                                popup.close();
                                clearInterval(popupInterval);
                                setLoading(false);
                            }
                        }
                        if (popupUrl.includes("error=")) {
                            setError("Salesforce authentication failed.");
                            popup.close();
                            clearInterval(popupInterval);
                            setLoading(false);
                        }
                    } catch (err) {
                        // Ignore cross-origin until redirect back
                    }
                }, 500);
            } else {
                setError("Failed to get Salesforce login URL.");
                setLoading(false);
            }
        } catch (err) {
            setError("Error connecting to the backend service.");
            setLoading(false);
        }
    };

    const handleGetAllAccounts = async () => {
        try {
            const accRes = await getAllAccounts();
            if (accRes?.status === 200) {
                setAccounts(accRes.result || []);
            }
        } catch (err) {
            setError("Error fetching Salesforce data.");
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

    useEffect(() => {
        if (accessToken && instanceUrl) {
            setIsLoggedIn(true);
            handleGetAllAccounts();
        }
    }, [accessToken, instanceUrl]);

    return (
        <div className="p-4">
            {loading && (
                <div className="flex justify-center items-center absolute h-screen bg-gray-200 w-screen opacity-50">
                    <p>Loading...</p>
                </div>
            )}
            <h2 className="text-xl font-bold mb-2">Salesforce Integration</h2>
            {error && <p className="text-red-500">Error: {error}</p>}
            <p>Access Token: {accessToken}</p>
            <p>Instance URL: {instanceUrl}</p>

            {!isLoggedIn ? (
                <button
                    onClick={handleLogin}
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Login with Salesforce
                </button>
            ) : (
                <>
                    <p className="mt-4">✅ Logged in to Salesforce</p>
                    <button onClick={handleSyncAccounts} className="bg-green-500 text-white p-2 rounded">Sync Accounts to Q4Magic</button>
                    <h3 className="text-lg font-semibold mt-4">Accounts</h3>
                    <button onClick={() => handleOpen()} className="bg-purple-700 text-white p-2 rounded mb-2">Add New Account</button>
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
                </>
            )}
        </div>
    );
};


const mapDispatchToProps = {
    setAlert,
};

export default connect(null, mapDispatchToProps)(Salesforce)