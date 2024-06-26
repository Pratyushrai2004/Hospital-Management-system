import React from "react";
import { Form, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsReducer";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/user/login", values);
      dispatch(hideLoading());
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        navigate("/");
        window.location.reload(); // Refresh the page after successful login
        toast.success(response.data.message);
      } else {
        if (response.data.message === "Incorrect password") {
          toast.error("Incorrect password");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="authentication">
      <div className="authentication-form card">
        <h1 className="card-title">Welcome Back</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={[{ required: true }]}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Phone Number" name="phone">
            <Input placeholder="Phone Number" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={[{ required: true }]}>
            <Input placeholder="Password" type="password" />
          </Form.Item>

          <Button className="primary-button mt-3" htmlType="submit">
            LOGIN
          </Button>

          <Link to="/register" className="anchor">
            Click Here To Register
          </Link>
        </Form>
      </div>
    </div>
  );
}
