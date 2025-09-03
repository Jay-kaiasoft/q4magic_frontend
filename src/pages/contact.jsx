import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { setAlert, setLoading } from '../redux/commonReducers/commonReducers';
import { syncToQ4Magic } from '../service/salesforce/syncToQ4Magic/syncToQ4MagicService';
import { getAllSyncRecords } from '../service/syncRecords/syncRecordsService';
import Badge from '@mui/material/Badge';
import { deleteContact, getAllContacts } from '../service/contact/contactService';
import { syncFromQ4magic } from '../service/salesforce/syncFromQ4magic/syncFromQ4magicService';
import ContactModel from '../models/contactModel';

const Contact = ({ setAlert, setLoading }) => {
    const [contacts, setContacts] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedContactId, setSelectedContactId] = useState(null);
    const [syncRecords, setSyncRecords] = useState([]);

    const handleOpen = (contactId = null) => {
        setSelectedContactId(contactId);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleGetAllContacts = async () => {
        setLoading(true);
        try {
            const accRes = await getAllContacts();
            if (accRes?.status === 200) {
                setContacts(accRes.result || []);
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

    const handlePushContacts = async () => {
        setLoading(true);
        try {
            const res = await syncFromQ4magic();
            if (res?.status === 200) {
                setLoading(false);
                setAlert({
                    open: true,
                    message: res?.message || "Contacts synced successfully",
                    type: "success"
                })
                handleGetAllContacts();
            } else {
                setLoading(false);
                setAlert({
                    open: true,
                    message: res?.message || "Failed to sync contacts",
                    type: "error"
                })
            }
        } catch (err) {
            setLoading(false);
            setAlert({
                open: true,
                message: err.message || "Error syncing opportunities to Q4Magic.",
                type: "error"
            })
        }
    }

    const handleSync = async () => {
        setLoading(true);
        try {
            const res = await syncToQ4Magic();
            if (res?.status === 200) {
                handlePushContacts();

            } else {
                setLoading(false);
                setAlert({
                    open: true,
                    message: res?.message || "Failed to sync contacts",
                    type: "error"
                })
            }
        } catch (err) {
            setLoading(false);
            setAlert({
                open: true,
                message: err.message || "Error syncing contacts to Q4Magic.",
                type: "error"
            })
        }
    }

    const handleDeleteContact = async (contactId) => {
        const res = await deleteContact(contactId);
        if (res.status === 200) {
            setAlert({
                open: true,
                message: "Contact deleted successfully",
                type: "success"
            });
            handleGetAllContacts();
        } else {
            setAlert({
                open: true,
                message: res?.message || "Failed to delete contact",
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
        handleGetAllContacts();
        handleGetAllSyncRecords();
    }, []);

    return (
        <div className='px-4'>
            <div className='flex justify-start items-center space-x-2 mb-4'>
                <button onClick={() => handleOpen()} className="bg-purple-700 text-white p-2 rounded">Add New Contact</button>
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
                        <th className="border p-2">First Name</th>
                        <th className="border p-2">Last Name</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Title</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts?.length > 0 ? contacts?.map((contact, index) => (
                        <tr key={index}>
                            <td className="border p-2">{contact.salesforceContactId}</td>
                            <td className="border p-2">{contact.firstName}</td>
                            <td className="border p-2">{contact.lastName}</td>
                            <td className="border p-2">{contact.emailAddress}</td>
                            <td className="border p-2">{contact.title}</td>

                            <td className="border p-2 flex justify-center items-center space-x-2">
                                <button
                                    onClick={() => handleOpen(contact.id)}
                                    className="bg-blue-500 text-white p-1 rounded"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => handleDeleteContact(contact.id)}
                                    className="bg-red-500 text-white p-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={6} className="border p-2 text-center">
                                No contacts found. Please Sync data from Salesforce.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <ContactModel
                open={open}
                handleClose={handleClose}
                contactId={selectedContactId}
                handleGetAllContacts={handleGetAllContacts}
                handleGetAllSyncRecords={handleGetAllSyncRecords}
            />
        </div>
    )
}

const mapDispatchToProps = {
    setAlert,
    setLoading
};

export default connect(null, mapDispatchToProps)(Contact)