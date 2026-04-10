import React, { useEffect, useState } from "react";
import UserLayout from "@/src/layout/userLayout";
import DashboardLayout from "@/src/layout/dashboardLayout";
import styles from "./styles.module.css";
import { useDispatch, useSelector } from "react-redux";
import { Base_url, clientServer } from "@/src/config";
import { getAboutUser } from "@/src/config/redux/action/authAction";

const MyProfile = () => {

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);

  const [userPost, setUserPost] = useState([]);

  const [profileData, setProfileData] = useState({
    name: "",
    bio: ""
  });

  const [showEduModal, setShowEduModal] = useState(false);
  const [showWorkModal, setShowWorkModal] = useState(false);

  const [educationData, setEducationData] = useState({
    degree: "",
    college: "",
    year: ""
  });

  const [workData, setWorkData] = useState({
    role: "",
    company: "",
    duration: ""
  });

  /* LOAD USER */

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  }, [dispatch]);

  /* SET PROFILE DATA */

  useEffect(() => {
    if (authState?.user?.userId) {
      setProfileData({
        name: authState.user.userId.name || "",
        bio: authState.user.bio || ""
      });
    }
  }, [authState.user]);

  /* FILTER POSTS */

  useEffect(() => {

    if (!postState.posts || !authState?.user?.userId?.username) return;

    const posts = postState.posts.filter((post) => {
      return post.userId.username === authState.user.userId.username;
    });

    setUserPost(posts);

  }, [postState.posts, authState.user]);



  /* UPDATE PROFILE PICTURE */

  const updateProfilePicture = async (file) => {

    if (!file) return;

    try {

      const formdata = new FormData();

      formdata.append("profilePicture", file);
      formdata.append("token", localStorage.getItem("token"));

      await clientServer.post("/update_profile_picture", formdata);

      dispatch(getAboutUser({ token: localStorage.getItem("token") }));

    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };



  /* UPDATE NAME + BIO */

  const updateProfileData = async () => {

    try {

      const token = localStorage.getItem("token");

      await Promise.all([

        clientServer.post("/user_update", {
          token,
          name: profileData.name
        }),

        clientServer.post("/update_profile_data", {
          token,
          bio: profileData.bio
        })

      ]);

      dispatch(getAboutUser({ token }));

    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };



  /* ADD EDUCATION */

  const addEducation = async () => {

    try {

      await clientServer.post("/add_education", {
        token: localStorage.getItem("token"),
        degree: educationData.degree,
        college: educationData.college,
        year: educationData.year
      });

      setShowEduModal(false);

      setEducationData({
        degree: "",
        college: "",
        year: ""
      });

      dispatch(getAboutUser({ token: localStorage.getItem("token") }));

    } catch (err) {
      console.log(err);
    }
  };



  /* ADD EXPERIENCE */

  const addWork = async () => {

    try {

      await clientServer.post("/add_experience", {
        token: localStorage.getItem("token"),
        role: workData.role,
        company: workData.company,
        duration: workData.duration
      });

      setShowWorkModal(false);

      setWorkData({
        role: "",
        company: "",
        duration: ""
      });

      dispatch(getAboutUser({ token: localStorage.getItem("token") }));

    } catch (err) {
      console.log(err);
    }
  };



  return (
    <UserLayout>
      <DashboardLayout>

        <div className={styles.profilePage}>

          {/* COVER */}
          <div className={styles.cover}></div>


          {/* PROFILE SECTION */}
          <div className={styles.profileSection}>

            <div className={styles.avatarContainer}>

              <img
                src={`${Base_url}/uploads/${authState.user?.userId?.profilePicture}?t=${Date.now()}`}
                className={styles.avatar}
                alt="profile"
              />

              <label htmlFor="profilePictureUpload" className={styles.cameraOverlay}>
                Edit
              </label>

              <input
                type="file"
                id="profilePictureUpload"
                className={styles.fileInput}
                accept="image/*"
                onChange={(e) => updateProfilePicture(e.target.files[0])}
              />

            </div>


            {/* USER DETAILS */}

            <div className={styles.userDetails}>

              <input
                className={styles.nameInput}
                value={profileData.name}
                onChange={(e) =>
                  setProfileData({ ...profileData, name: e.target.value })
                }
              />

              <p className={styles.username}>
                @{authState.user?.userId?.username}
              </p>

              <textarea
                className={styles.bio}
                value={profileData.bio || ""}
                placeholder="Write something about yourself..."
                onChange={(e) =>
                  setProfileData({ ...profileData, bio: e.target.value })
                }
              />

              <button
                className={styles.updateBtn}
                onClick={updateProfileData}
              >
                Update Profile
              </button>

            </div>

          </div>



          {/* CONTENT */}

          <div className={styles.content}>

            {/* EDUCATION */}

            <div className={styles.section}>

              <div className={styles.sectionHeader}>
                <h3>Education</h3>
                <button className={styles.addBtn} onClick={()=>setShowEduModal(true)}>+ Add</button>
              </div>

              {authState.user?.education?.length > 0 ? (
                authState.user.education.map((edu,i)=>(
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

              <div className={styles.sectionHeader}>
                <h3>Experience</h3>
                <button className={styles.addBtn} onClick={()=>setShowWorkModal(true)}>+ Add</button>
              </div>

              {authState.user?.experience?.length > 0 ? (
                authState.user.experience.map((exp,i)=>(
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



            {/* POSTS */}

            <div className={styles.section}>

              <h3>Recent Activity</h3>

              {userPost?.length > 0 ? (
                userPost.map((post)=>(
                  <div key={post._id} className={styles.post}>

                    <div className={styles.postHeader}>
                      <span className={styles.postTime}>
                        {new Date(post.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <p className={styles.postText}>{post.body}</p>

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



          {/* EDUCATION MODAL */}

          {showEduModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>

                <h3>Add Education</h3>

                <input
                  placeholder="Degree"
                  value={educationData.degree}
                  onChange={(e)=>setEducationData({...educationData,degree:e.target.value})}
                />

                <input
                  placeholder="College"
                  value={educationData.college}
                  onChange={(e)=>setEducationData({...educationData,college:e.target.value})}
                />

                <input
                  placeholder="Year"
                  value={educationData.year}
                  onChange={(e)=>setEducationData({...educationData,year:e.target.value})}
                />

                <div className={styles.modalActions}>
                  <button className={styles.addBtn} onClick={addEducation}>Save</button>
                  <button className={styles.addBtn} onClick={()=>setShowEduModal(false)}>Cancel</button>
                </div>

              </div>
            </div>
          )}



          {/* WORK MODAL */}

          {showWorkModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>

                <h3>Add Experience</h3>

                <input
                  placeholder="Role"
                  value={workData.role}
                  onChange={(e)=>setWorkData({...workData,role:e.target.value})}
                />

                <input
                  placeholder="Company"
                  value={workData.company}
                  onChange={(e)=>setWorkData({...workData,company:e.target.value})}
                />

                <input
                  placeholder="Duration"
                  value={workData.duration}
                  onChange={(e)=>setWorkData({...workData,duration:e.target.value})}
                />

                <div className={styles.modalActions}>
                  <button className={styles.addBtn} onClick={addWork}>Save</button>
                  <button className={styles.addBtn} onClick={()=>setShowWorkModal(false)}>Cancel</button>
                </div>

              </div>
            </div>
          )}

        </div>

      </DashboardLayout>
    </UserLayout>
  );
};

export default MyProfile;