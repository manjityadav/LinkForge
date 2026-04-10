import { getAllUSers } from "@/src/config/redux/action/authAction";
import DashboardLayout from "@/src/layout/dashboardLayout";
import UserLayout from "@/src/layout/userLayout";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import { Base_url } from "@/src/config";
import { useRouter } from "next/router";

const Discover = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router=useRouter()

  useEffect(() => {
    dispatch(getAllUSers());
  },[]);

  
  return (
    <UserLayout>
      <DashboardLayout>
        {authState.all_users
  .filter((user) => user?.userId?.username !== authState.user?.userId?.username)
  .map((user) => {
    return (
      <div
        onClick={() => {
          router.push(`/ViewProfile/${user?.userId?.username}`);
        }}
        key={user._id}
        className={styles.discoverCard}
      >
        <img
          className={styles.profileImage}
          src={`${Base_url}/uploads/${user?.userId?.profilePicture}`}
          alt="profile"
        />

        <div className={styles.userInfo}>
          <h3>{user?.userId?.name}</h3>
          <p>@ {user?.userId?.username}</p>
          <button className={styles.viewBtn}>View Profile</button>
        </div>
      </div>
    );
  })}
      </DashboardLayout>
    </UserLayout>
  );
};

export default Discover;
