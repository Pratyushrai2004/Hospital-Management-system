import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { hideLoading, showLoading } from '../redux/alertsReducer';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button } from 'antd';

function UserProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState({});

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get(`/api/user/get-user-profile/${user._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setInitialValues(response.data.data);
        form.setFieldsValue(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error('Error fetching user data:', error);
      toast.error('Error fetching user data');
    }
  };

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post('/api/user/update-user-profile', {
        ...values,
        userId: user._id,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error('Error updating user profile:', error);
      toast.error('Error updating user profile');
    }
  };

  return (
    <Layout>
      <h1 className="page-title">User Profile</h1>
      <hr />
      <Form form={form} onFinish={onFinish} initialValues={initialValues}>
        <Form.Item name="fname" label="First Name" rules={[{ required: true }]}>
          <Input placeholder="Enter your first name" />
        </Form.Item>
        <Form.Item name="lname" label="Last Name" rules={[{ required: true }]}>
          <Input placeholder="Enter your last name" />
        </Form.Item>
        <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
          <Input placeholder="Enter your phone number" />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input placeholder="Enter your email" disabled />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Update Profile
        </Button>
      </Form>
    </Layout>
  );
}

export default UserProfile;
