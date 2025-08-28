import { useState, useEffect } from "react";
import { connectToSalesforce } from "./service/salesforce/connect/salesforceConnectService";
import { connect } from "react-redux";
import { setAlert, setLoading } from "./redux/commonReducers/commonReducers";
import { Tabs } from "./components/common/tabs/tabs";
import Account from "./pages/account";
import Opportunities from "./pages/opportunities";
import Contact from "./pages/contact";

const tabData = [
    {
        label: 'Accounts',
    },
    {
        label: 'Opportunities',
    },
    {
        label: 'Contacts',
    }
]

const Salesforce = ({ setAlert, setLoading }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [accessToken, setAccessToken] = useState(sessionStorage.getItem("accessToken_salesforce") || "");
    const [instanceUrl, setInstanceUrl] = useState(sessionStorage.getItem("instanceUrl_salesforce") || "");
    const [error, setError] = useState(null);
    const [selectedTab, setSelectedTab] = useState(0);

    const handleChangeTab = (value) => {
        setSelectedTab(value);
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

    const handleLogout = () => {
        setAccessToken(null);
        setInstanceUrl(null);
        sessionStorage.removeItem("accessToken_salesforce");
        sessionStorage.removeItem("instanceUrl_salesforce");
        setIsLoggedIn(false);
    };

    useEffect(() => {
        if (accessToken && instanceUrl) {
            setIsLoggedIn(true);
        }
    }, [accessToken, instanceUrl]);

    return (
        <div className="p-4">
            <div>
                <h2 className="text-xl font-bold mb-2">Salesforce Integration</h2>
                {error && <p className="text-red-500">Error: {error}</p>}
            </div>
            {/* <p>Access Token: {accessToken}</p>
            <p>Instance URL: {instanceUrl}</p> */}

            {!isLoggedIn ? (
                <button
                    onClick={handleLogin}
                    className="bg-blue-500 text-white p-2 rounded"
                >
                    Login with Salesforce
                </button>
            ) : (
                <>
                    <div className="flex justify-start items-center gap-4 w-full">
                        <div className="grow">
                            <p className="mt-4">✅ Logged in to Salesforce</p>
                        </div>
                        <div>
                            <button onClick={handleLogout} className="bg-red-500 text-white p-2 rounded">
                                Logout
                            </button>
                        </div>
                    </div>

                    <div className='my-4'>
                        <Tabs tabsData={tabData} selectedTab={selectedTab} handleChange={handleChangeTab} type={'underline'} />
                    </div>

                    {
                        selectedTab === 0 && (
                            <Account />
                        )
                    }
                    {
                        selectedTab === 1 && (
                            <Opportunities />
                        )
                    }
                    {
                        selectedTab === 2 && (
                            <Contact />
                        )
                    }
                </>
            )}
        </div>
    );
};


const mapDispatchToProps = {
    setAlert,
    setLoading
};

export default connect(null, mapDispatchToProps)(Salesforce)