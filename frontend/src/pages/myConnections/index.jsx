import { acceptConnection, getConnectionRequest } from '@/src/config/redux/action/authAction'
import DashboardLayout from '@/src/layout/dashboardLayout'
import UserLayout from '@/src/layout/userLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from './index.module.css'
import { Base_url } from '@/src/config'
import { useRouter } from 'next/router'
const MyConnections = () => {

  const dispatch = useDispatch();
  const router=useRouter();
  const authState = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getConnectionRequest({ token: localStorage.getItem('token') }))
  }, [authState.connectionRequest])

  console.log(authState,"my authstate");
  
  return (
    <UserLayout>
      <DashboardLayout>
        <h4>My Connections</h4>
        <div className={styles.requestContainer}>
          {authState?.connectionRequest.length===0 && <h2>No Connection Request Pending</h2>}
          {authState?.connectionRequest.length !== 0 && authState.connectionRequest.filter((connection)=>connection.status==null).map((req) => {
            return (
              <div onClick={()=>{
                router.push(`/ViewProfile/${req.userId?.username}`)
              }}
              key={req._id} className={styles.requestCard}>

                <img
                  src={`${Base_url}/uploads/${req.userId?.profilePicture}`}
                  className={styles.avatar}
                  alt="profile"
                />

                <div className={styles.userInfo}>
                  <h3>{req.userId?.name}</h3>
                  <p>@{req.userId?.username}</p>
                </div>

                <div className={styles.actions}>
                  <button
                    className={styles.acceptBtn}
                    onClick={(e) => {
                      e.stopPropagation()
                      dispatch(acceptConnection({
                        token: localStorage.getItem("token"),
                        requestId: req._id,
                        action_type: "accept"
                      }))
                    }}
                  >
                    Accept
                  </button>
                </div>

              </div>
            );
          })}

          {authState.connectionRequest.length !== 0 && authState.connectionRequest.filter((connection)=>connection.status!==null).map((req) => {
            return (
                <div onClick={()=>{
                router.push(`/ViewProfile/${req?.userId?.username}`)
              }}
              key={req._id} className={styles.requestCard}>

                <img
                  src={`${Base_url}/uploads/${req?.userId?.profilePicture}`}
                  className={styles.avatar}
                  alt="profile"
                />

                <div className={styles.userInfo}>
                  <h3>{req.userId?.name}</h3>
                  <p>@{req.userId?.username}</p>
                </div>

                <div className={styles.actions}>
                </div>

              </div>
            )})}
        </div>
      </DashboardLayout>
    </UserLayout>
  )
}

export default MyConnections
