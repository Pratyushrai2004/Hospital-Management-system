import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsReducer";
import axios from "axios";
import { Table, Tag, Button } from "antd";
import { toast } from "react-hot-toast";
import moment from "moment";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();

  const getAppointmentsData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(
        "/api/doctor/get-appointments-by-doctor-id",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  const changeAppointmentStatus = async (record, status) => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/change-appointment-status",
        {
          appointmentId: record._id,
          status: status,
         
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        getAppointmentsData(); // Refresh the doctors list after status change
        toast.success(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Error in doctor status");
    }
  };

  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Patient",
      dataIndex: "fName",
      key: "name",
      render: (text, record) =>
        `${record.userInfo.fName} ${record.userInfo.lName}`,
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) =>
        `on ${moment(record.date).format("DD-MM-YYYY")} at ${moment(
          record.time
        ).format("HH:mm")}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "approved" ? "green" : "orange"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div style={{ display: "flex" }}>
          {record.status === "pending" && (
            <div>
              <Button
                type="link"
                onClick={() => changeAppointmentStatus(record, "approved")}
              >
                Approve
              </Button>
              <Button
                type="link"
                onClick={() => changeAppointmentStatus(record, "rejected")}
              >
                Reject
              </Button>
            </div>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    getAppointmentsData();
  }, []);
  return (
    <Layout>
      <h1 className="page-title">Appointments</h1>
      <Table columns={columns} dataSource={appointments} />
    </Layout>
  );
}

export default DoctorAppointments;
