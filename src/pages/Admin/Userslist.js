import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsReducer";
import axios from "axios";
import { Table } from "antd";
import moment from "moment"
function Userslist() {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  const getUsersData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/admin/get-all-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        const usersWithData = response.data.data.map(user => ({
          ...user,
          name: `${user.fname} ${user.lname}`,
          phone: user.phone, 
        }));
        setUsers(usersWithData);
      }
    } catch (error) {
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getUsersData();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone', 
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      render: (record, text) => moment(record.createdAt).format("DD-MM-YYYY")
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => (
        <div className="d-flex">
          <h1 className="anchor-3">Block</h1>
        </div>
      )
    }
  ];

  return (
    <Layout>
      <h1 className="page-title">Users List</h1>
      <Table columns={columns} dataSource={users} />
    </Layout>
  );
}

export default Userslist;
