import React, { useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";

export default function Home() {
  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.post(
          "/api/user/get-user-info-by-id",
          {}, //payload
          {
            headers: {    //https header 
              Authorization: "Bearer " + localStorage.getItem("token"), //Bearer type hai and authorization is https header which is used to send credentials 
            },
          }
        );
      
      } catch (error) {
        
      }
    };

    getData();
  }, []); // Empty dependency array to run only once when component mounts

  return (
    <div>
      <Layout>
        <h1>home page</h1>
      </Layout>
    </div>
  );
}

