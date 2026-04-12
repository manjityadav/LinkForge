import DashboardLayout from '@/src/layout/dashboardLayout';
import UserLayout from '@/src/layout/userLayout';
import React, { useEffect, useState } from 'react'
import styles from './index.module.css'
import { Base_url, clientServer } from '@/src/config';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/src/config/redux/action/postAction';
import { getConnectionRequest, getMyConnectionsRequest, sendConnectionRequest } from '@/src/config/redux/action/authAction';

const ViewProfile = ({ userProfile }) => {

  const router = useRouter()
  const authState = useSelector((state) => state.auth)
  const postState = useSelector((state) => state.posts)

  const dispatch = useDispatch()

  const [userPost, setuserPost] = useState(null)
  const [iscurrentuserconnected, setiscurrentuserconnected] = useState(false)
  const [isconnectionNull, setisconnectionNull] = useState(false)

  const getUserPost = async () => {
    await dispatch(getAllPosts())
    await dispatch(getMyConnectionsRequest({
      token: localStorage.getItem("token")
    }
    ));
    await dispatch(getConnectionRequest({token:localStorage.getItem("token")}))
  }

  useEffect(() => {
    getUserPost();
  }, []);

  useEffect(() => {
    if (!postState.posts || !router.query.username) return;

    let posts = postState.posts.filter((post) => {
      return post.userId.username === router.query.username;
    });

    setuserPost(posts);
  }, [postState.posts, router.query.username]);


  useEffect(() => {
    const connections = authState?.connections || [];

    console.log("connections:", connections);
    console.log("profile:", userProfile?.userId?._id);


    if (connections.some(
      (conn) =>
        String(conn?.connectionId?._id) ===
        String(userProfile?.userId?._id)
    )) {
      setiscurrentuserconnected(true)
    };

    if (
      connections.find(
        user => user?.connectionId?._id === userProfile?.userId?._id
      )?.status === null
    ) {
      setisconnectionNull(true)
    }

    if(authState.connectionRequest.some((user)=>user.userId._id ===userProfile.userId._id)){
      setiscurrentuserconnected(true)
      if(authState.connectionRequest.find(user=>user.userId._id ===userProfile.userId._id).status==true){
        setisconnectionNull(false)
      }
    }

  }, [authState.connections, userProfile,authState.connectionRequest]);


  console.log(authState)
  return (
    <UserLayout>
      <DashboardLayout>

        <div className={styles.profilePage}>

          {/* COVER */}
          <div className={styles.cover}></div>

          {/* PROFILE INFO */}
          <div className={styles.profileSection}>
            <img
              src={`${Base_url}/uploads/${userProfile?.userId.profilePicture}`}
              className={styles.avatar}
              alt="profile"
            />

            <div className={styles.userDetails}>
              <h2>{userProfile?.userId.name}</h2>
              <p className={styles.username}>@{userProfile?.userId.username}</p>

              <p className={styles.bio}>
                {userProfile?.bio || "Building something cool 🚀"}
              </p>
                 
              <div className={styles.meta}>
                <span><b>{authState?.connectionRequest?.length}</b> Following</span>
                <span><b>{authState?.connections?.length}</b> Followers</span>
              </div>

              {/* ACTION BUTTONS */}
              <div className={styles.profileActions}>

                {iscurrentuserconnected ? (
                  <button className={styles.followBtn}>
                    {isconnectionNull ? "Pending" : "Connected"}
                  </button>
                ) : (
                  <button
                    className={styles.followBtn}
                    onClick={() => {
                      dispatch(
                        sendConnectionRequest({
                          token: localStorage.getItem("token"),
                          userId: userProfile.userId._id
                        })
                      );
                    }}
                  >
                    Connect
                  </button>
                )}

                {/* Resume Download */}
                <div
                  onClick={async () => {
                    const response = await clientServer.get(
                      `/download_resume?id=${userProfile.userId._id}`
                    );

                    window.open(`${Base_url}/uploads/${response.data.message}`, "_blank");
                  }}
                  className={styles.resumeBtn}
                >
                  Download Resume
                </div>
              </div>
            </div>
          </div>

          <div className={styles.content}>

            {/* EDUCATION */}
            <div className={styles.section}>
              <h3>Education</h3>

              {userProfile?.education?.length > 0 ? (
                userProfile.education.map((edu, i) => (
                  <div key={i} className={styles.item}>
                    <h4>{edu.degree}</h4>
                    <p>{edu.college}</p>
                    <span>{edu.year}</span>
                  </div>
                ))
              ) : (
                <p className={styles.empty}>No education added</p>
              )}
            </div>

            {/* EXPERIENCE */}
            <div className={styles.section}>
              <h3>Experience</h3>

              {userProfile?.experience?.length > 0 ? (
                userProfile.experience.map((exp, i) => (
                  <div key={i} className={styles.item}>
                    <h4>{exp.role}</h4>
                    <p>{exp.company}</p>
                    <span>{exp.duration}</span>
                  </div>
                ))
              ) : (
                <p className={styles.empty}>No experience added</p>
              )}
            </div>

            {/* RECENT ACTIVITY */}
            <div className={styles.section}>
              <h3>Recent Activity</h3>

              {userPost?.length > 0 ? (
                userPost.map((post) => (
                  <div key={post._id} className={styles.post}>

                    {/* HEADER */}
                    <div className={styles.postHeader}>
                      <span className={styles.postTime}>
                        {new Date(post.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {/* TEXT */}
                    <p className={styles.postText}>{post.body}</p>

                    {/* IMAGE */}
                    {post.media && (
                      <img
                        className={styles.postImage}
                        src={`${Base_url}/uploads/${post.media}`}
                        alt="post"
                      />
                    )}

                  </div>
                ))
              ) : (
                <p className={styles.empty}>No posts yet</p>
              )}
            </div>

          </div>


        </div>

      </DashboardLayout>
    </UserLayout>
  )
}

export async function getServerSideProps(context) {

  const request = await clientServer.get("/user/get_user_based_on_username", {
    params: {
      username: context.query.username
    }
  })

  return { props: { userProfile: request.data.profile } }
}

export default ViewProfile;
