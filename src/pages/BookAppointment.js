import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import axios from "axios";
import { hideLoading, showLoading } from "../redux/alertsReducer";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Col,
  DatePicker,
  Row,
  TimePicker,
  Card,
  Typography,
} from "antd";
import { Navigate } from "react-router-dom";
import moment from "moment";

const { Meta } = Card;
const { Text, Title } = Typography;

function BookAppointment() {
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(false);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const dispatch = useDispatch();
  const params = useParams();

  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/doctor/get-doctor-info-by-id",
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctor(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching doctor data:", error);
      dispatch(hideLoading());
    }
  };

  const bookNow = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/book-appointment",
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          userInfo: {
            user,
            fName: user.fname,
            lName: user.lname,
          },
          date: date.format("DD-MM-YYYY"),
          time: time.format("HH:mm"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/appointments')
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error("Error booking appointment");
      dispatch(hideLoading());
    }
  };

  const checkAvailability = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/check-booking-availability",
        {
          doctorId: params.doctorId,
          date: date.format("DD-MM-YYYY"),
          time: time.format("HH:mm"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        setIsAvailable(true);
      } else {
        toast.error(response.data.message);
        setIsAvailable(false);
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      toast.error("Error checking availability");
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    getDoctorData();
  }, []);

  return (
    <Layout>
      {doctor && (
        <Row gutter={16}>
          <Col span={12}>
            <div className="appointment-form-wrapper">
              <Title level={2} className="page-title-appointment">
                {doctor.firstName} {doctor.lastName}
              </Title>
              <hr />
              <h1 className="timings-header">Timings: {doctor.timings[0]} - {doctor.timings[1]}</h1>
              <div className="appointment-form">
                <DatePicker
                  className="appointment-date"
                  format="DD-MM-YYYY"
                  onChange={(momentDate) => {
                    setIsAvailable(false);
                    setDate(momentDate);
                  }}
                />
                <TimePicker
                  className="appointment-time"
                  format="HH:mm"
                  onChange={(timeValue) => {
                    setIsAvailable(false);
                    setTime(timeValue);
                  }}
                />
                <Button
                  type="primary"
                  className="appointment-button"
                  onClick={checkAvailability}
                >
                  Check Availability
                </Button>
                {isAvailable && (
                  <Button
                    type="primary"
                    className="appointment-button"
                    onClick={bookNow}
                  >
                    Book Now
                  </Button>
                )}
              </div>
              <Card className="doctor-card">
                <Meta
                  title="DoctorDetails"
                  description={
                    <>
                      <Text strong>Specialization:</Text>{" "}
                      <Text>{doctor.specialization}</Text>
                      <br />
                      <Text strong>Experience:</Text>{" "}
                      <Text>{doctor.experience} years</Text>
                      <br />
                      <Text strong>Fee per Visit:</Text>{" "}
                      <Text>{doctor.feePerConsultation} ₹</Text>
                      <br/>
                      <Text strong>Website:</Text>{" "}
                      <Text>{doctor.website}</Text>
                    </>
                  }
                />
              </Card>
            </div>
          </Col>
          <Col span={12}>
            <div className="image-container">
              <img
                src="https://static.vecteezy.com/system/resources/previews/002/208/096/original/doctor-appointment-rgb-color-icon-vector.jpg"
                alt="Doctor Appointment"
                className="doctor-image"
              />
            </div>
          </Col>
        </Row>
      )}
    </Layout>
  );
}

export default BookAppointment;
