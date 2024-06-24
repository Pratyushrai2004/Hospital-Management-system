import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { Col, Row } from "antd";
import Doctor from "../components/Doctor";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/alertsReducer";

export default function Home() {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      try {
        dispatch(showLoading());
        const response = await axios.get("/api/user/get-all-approved-doctors", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        dispatch(hideLoading());
        console.log("Response from backend:", response);
        if (response.data.success) {
          setDoctors(response.data.data);
        }
      } catch (error) {
        dispatch(hideLoading());
        console.error("Error fetching doctors:", error);
      }
    };

    getData();
  }, [dispatch]);

  return (
    <div>
      <Layout>
        <Row gutter={[16, 16]}>
          {doctors.map((doctor) => (
            <Col key={doctor._id} span={8} xs={24} sm={24} lg={8}>
              <Doctor doctor={doctor} />
            </Col>
          ))}
        </Row>
      </Layout>
    </div>
  );
}
