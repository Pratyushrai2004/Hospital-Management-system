import React from "react";
import { Input } from "antd";

const CustomTimeInput = ({ value = [], onChange }) => {
  const handleStartChange = (e) => {
    const newTime = [e.target.value, value[1]];
    onChange(newTime);
  };

  const handleEndChange = (e) => {
    const newTime = [value[0], e.target.value];
    onChange(newTime);
  };

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      <Input
        type="time"
        value={value[0] || ""}
        onChange={handleStartChange}
      />
      <Input
        type="time"
        value={value[1] || ""}
        onChange={handleEndChange}
      />
    </div>
  );
};

export default CustomTimeInput;
