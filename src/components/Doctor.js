import React from "react";
import { Card, Typography } from "antd";
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom"
const { Meta } = Card;
const { Text } = Typography;

function Doctor ({ doctor })  {
  const navigate = useNavigate();
  return (
    <Card className="doctor-card" onClick={()=>navigate(`/book-appointment/${doctor._id}`)}>
      <Meta
        title={`${doctor.firstName} ${doctor.lastName}`}
        description={
          <>
            <hr/>
            <Text strong>Specialization:</Text>{" "}
            <Text>{doctor.specialization}</Text>
            <br />
            <Text strong>Experience:</Text>{" "}
            <Text>{doctor.experience} years</Text>
            <br />
            <Text strong>Timings:</Text>{" "}
            <Text>{doctor.timings.join(", ")}</Text>
            <br />
            <Text strong>Fee per Visit:</Text>{" "}
            <Text>{doctor.feePerConsultation} ₹</Text>
          </>
        }
      />
    </Card>
  );
};

Doctor.propTypes = {
  doctor: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    specialization: PropTypes.string.isRequired,
    experience: PropTypes.number.isRequired,
    timings: PropTypes.arrayOf(PropTypes.string).isRequired,
    feePerVisit: PropTypes.number.isRequired,
  }).isRequired,
};

export default Doctor;
