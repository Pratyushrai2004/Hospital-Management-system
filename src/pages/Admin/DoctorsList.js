import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsReducer";
import axios from "axios";
import { Table, Tag, Button } from "antd";
import { toast } from 'react-hot-toast';
import moment from "moment";

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();

  const getDoctorsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/admin/get-all-doctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const changeDoctorStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/admin/change-doctor-account-status", {
        doctorId: record._id,
        userId: record.userId,
        status: status,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        getDoctorsData();// Refresh the doctors list after status change
        toast.success(response.data.message); 
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error('Error in doctor status');
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'firstName',
      key: 'name',
      render: (text, record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'Specialization',
      dataIndex: 'specialization',
      key: 'specialization',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'approved' ? 'green' : 'orange'}>{status}</Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: (record, text) => moment(record.createdAt).format("DD-MM-YYYY")
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <div style={{ display: 'flex' }}>
          {record.status === "pending" && <Button type="link" onClick={() => changeDoctorStatus(record, 'approved')}>Approve</Button>}
          {record.status === "approved" && <Button type="link" onClick={() => changeDoctorStatus(record, 'blocked')}>Block</Button>}
        </div>
      ),
    }
  ];

  return (
    <Layout>
      <h1 className="page-title">Doctors List</h1>
      <Table columns={columns} dataSource={doctors} rowKey="_id" />
    </Layout>
  );
}

export default DoctorsList;
