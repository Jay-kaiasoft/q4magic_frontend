import React, { useEffect, useState } from 'react'
import { deleteOpportunity, getAllOpportunities } from '../service/opportunities/opportunitiesService';
import { syncToQ4Magic } from '../service/salesforce/syncToQ4Magic/syncToQ4MagicService';
import { syncFromQ4magic } from '../service/salesforce/syncFromQ4magic/syncFromQ4magicService';
import { connect } from 'react-redux';
import { setAlert } from '../redux/commonReducers/commonReducers';
import OpportunitiesModel from '../models/opportunitiesModel';
import { getAllSyncRecords } from '../service/syncRecords/syncRecordsService';
import { Badge } from '@mui/material';

const Opportunities = ({ setAlert }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [syncRecords, setSyncRecords] = useState([]);

  const handleOpen = (opportunityId = null) => {
    setSelectedOpportunityId(opportunityId);
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  const handleGetAllOpportunities = async () => {
    setLoading(true);
    try {
      const oppRes = await getAllOpportunities();
      if (oppRes?.status === 200) {
        handleGetAllSyncRecords();
        setOpportunities(oppRes.result || []);
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

  const handlePushOpportunities = async () => {
    setLoading(true);
    try {
      const res = await syncFromQ4magic();
      if (res?.status === 200) {
        setLoading(false);
        setAlert({
          open: true,
          message: res?.message || "Opportunities synced successfully",
          type: "success"
        })
        handleGetAllOpportunities();
      } else {
        setLoading(false);
        setAlert({
          open: true,
          message: res?.message || "Failed to sync opportunities",
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

  const handleDeleteOpportunity = async (opportunityId) => {
    const res = await deleteOpportunity(opportunityId);
    if (res.status === 200) {
      setAlert({
        open: true,
        message: "Opportunity deleted successfully",
        type: "success"
      });
      handleGetAllOpportunities();
    } else {
      setAlert({
        open: true,
        message: res?.message || "Failed to delete opportunity",
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

  const handleSync = async () => {
    setLoading(true);
    try {
      const res = await syncToQ4Magic();
      if (res?.status === 200) {
        handlePushOpportunities();
      } else {
        setLoading(false);
        setAlert({
          open: true,
          message: res?.message || "Failed to sync opportunities",
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

  useEffect(() => {
    handleGetAllOpportunities();
    handleGetAllSyncRecords();
  }, []);

  return (
    <div className='px-4'>
      {loading && (
        <div className="flex justify-center items-center absolute h-screen bg-gray-200 w-screen opacity-50">
          <p>Loading...</p>
        </div>
      )}
      <div className='flex justify-start items-center space-x-2 mb-4'>
        <button onClick={() => handleOpen()} className="bg-purple-700 text-white p-2 rounded">Add New Opportunity</button>
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
            <th className="border p-2">Opportunity Name</th>
            <th className="border p-2">Stage</th>
            <th className="border p-2">Amount</th>
            <th className="border p-2">Close Date</th>
            <th className="border p-2">Next Step</th>
          </tr>
        </thead>
        <tbody>
          {opportunities.map((opp) => (
            <tr key={opp.id}>
              <td className="border p-2">{opp.salesforceOpportunityId}</td>
              <td className="border p-2">{opp.opportunity}</td>
              <td className="border p-2">{opp.salesStage}</td>
              <td className="border p-2">{opp.dealAmount?.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td>
              <td className="border p-2">
                {opp.closeDate ? new Date(opp.closeDate).toLocaleDateString() : ""}
              </td>

              <td className="border p-2">{opp.nextSteps}</td>
              <td className="border p-2 flex justify-center items-center space-x-2">
                <button
                  onClick={() => handleOpen(opp.id)}
                  className="bg-blue-500 text-white p-1 rounded"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDeleteOpportunity(opp.id)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <OpportunitiesModel open={open} handleClose={handleClose} opportunityId={selectedOpportunityId} handleGetAllOpportunities={handleGetAllOpportunities} handleGetAllSyncRecords={handleGetAllSyncRecords} />
    </div>
  )
}

const mapDispatchToProps = {
  setAlert,
};

export default connect(null, mapDispatchToProps)(Opportunities);