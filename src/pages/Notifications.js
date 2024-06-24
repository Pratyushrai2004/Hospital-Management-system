import React from "react";
import Layout from "../components/Layout";
import { Tabs } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/alertsReducer";
import toast from "react-hot-toast";
import axios from "axios";
import { setUser} from "../redux/userSlice"

function Notifications() {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const markAllAsSeen = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/mark-all-notifications-as-seen",
        { userId: user._id },{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
       
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("something went wrong");
    }
  };
  const deleteAll = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/delete-all-notifications",
        { userId: user._id },{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
       
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("something went wrong");
    }
  };

  return (
    <Layout>
      <h1 className="page-title">Notifications</h1>
      <Tabs>
        <Tabs.TabPane tab="Unread" key={0}>
          {user?.unseenNotifications?.map((notification, index) => (
            <div
              className="noti-card"
              key={index}
              onClick={() => navigate(notification.onClickPath)}
            >
              <div className="noti-card-text">{notification.message}</div>
            </div>
          ))}
          <div className="clear">
            <h1 className="anchor-2" onClick={() => markAllAsSeen()}>
              Mark all as read
            </h1>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Read" key={1}>
          <div className="clear">
            <h1 className="anchor-2" onClick={() => deleteAll()}>Delete all Notifications</h1>
          </div>
          {user?.seenNotifications?.map((notification, index) => (
            <div
              className="noti-card"
              key={index}
              onClick={() => navigate(notification.onClickPath)}
            >
              <div className="noti-card-text">{notification.message}</div>
            </div>
          ))}
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
}

export default Notifications;
