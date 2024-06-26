import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsReducer";
import axios from "axios";
import { Table, Tag, Button } from "antd";
import { toast } from "react-hot-toast";
import moment from "moment";
function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();

  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/user/get-appointments-by-user-id", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const columns = [
    {
        title: "Id",
        dataIndex: "_id",
    },
    {
      title: 'Doctor',
      dataIndex: 'firstName',
      key: 'name',
      render: (text, record) => `${record.doctorInfo.firstName} ${record.doctorInfo.lastName}`,
    },
    {
      title: 'Specialization',
      dataIndex: 'specialization',
      key: 'specialization',
      render: (text, record) => `${record.doctorInfo.specialization}`
    },
    {
        title: "Date & Time",
        dataIndex: "createdAt",
        render: (text, record) => `on ${moment(record.date).format("DD-MM-YYYY")} at ${moment(record.time).format("HH:mm")}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'approved' ? 'green' : 'orange'}>{status}</Tag>
      ),
    },
    
  ];

  useEffect(() => {
    getAppointmentsData();
  }, []);
  return  <Layout>
  <h1 className="page-title">Appointments</h1>
  <Table columns={columns} dataSource={appointments}  />
</Layout>;
}

export default Appointments;
