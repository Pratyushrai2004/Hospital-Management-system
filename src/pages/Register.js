import React from "react";
import { Form, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom"; 
import axios from "axios";
import toast from "react-hot-toast";
import {useDispatch} from "react-redux"
import { hideLoading, showLoading } from "../redux/alertsReducer";


export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/user/register", values);
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        toast("Redirecting to login page");
        navigate("/login");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("somthing went wrong");
    }
  };
  return (
    <div className="authentication">
      <div className="authentication-form card">
        <h1 className="card-title">Hii Nice To Meet You</h1>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="First Name" name="fname" >
            <Input placeholder="First Name" />
          </Form.Item>
          <Form.Item label="Last Name" name="lname">
            <Input placeholder="Last Name" />
          </Form.Item>
          <Form.Item label="Phone Number" name="phone">
            <Input placeholder="Phone Number" />
          </Form.Item>
          <Form.Item label="Email" name="email" rules = {[{required: true}]}>
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules = {[{required: true}]}>
            <Input placeholder="Password" type="password" />
          </Form.Item>

          <Button className="primary-button mt-3" htmlType="submit">
            REGISTER
          </Button>

          <Link to="/login" className="anchor">
            Click Here To Login
          </Link>
        </Form>
      </div>
    </div>
  );
}
