import {
  getAboutUser,
  getAllUSers,
} from "@/src/config/redux/action/authAction";
import {
  createPost,
  deletePost,
  getAllComments,
  getAllPosts,
  incrementLikes,
  postComment,
} from "@/src/config/redux/action/postAction";
import DashboardLayout from "@/src/layout/dashboardLayout";
import UserLayout from "@/src/layout/userLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./index.module.css";
import { Base_url } from "@/src/config";
import { resetPostId } from "@/src/config/redux/reducer/postReducer";

const Dashboard = () => {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  const [postText, setPostText] = useState("");
  const [fileContent, setFileContent] = useState(null);
  const [commentText, setCommentText] = useState("");

  const fileRef = useRef(null); // used to reset file input



  useEffect(() => {
    if (authState.isTokenThere) {
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }

    if (!authState.all_profiles_fetched) {
      dispatch(getAllUSers());
    }
  }, [authState.isTokenThere]);

  const handleUpload = async () => {
    if (!postText.trim() && !fileContent) return;

    await dispatch(createPost({ file: fileContent, body: postText }));

    // clear textarea
    setPostText("");

    // clear file
    setFileContent(null);

    // refresh posts
    dispatch(getAllPosts());

    // reset file input
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };  

  if (authState.user) {
    return (
      <UserLayout>
        <DashboardLayout>
          <div className={styles.scrollComponent}>
            <div className={styles.createPostContainer}>
              <img
                className={styles.userProfile}
                src={`${Base_url}/uploads/${authState.user?.userId?.profilePicture}`}
                alt="profile"
              />

              <textarea
                placeholder="Start a post..."
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
              ></textarea>

              <label htmlFor="fileupload">
                <div className={styles.fab}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                </div>
              </label>

              <input
                ref={fileRef}
                onChange={(e) => setFileContent(e.target.files[0])}
                type="file"
                hidden
                id="fileupload"
              />

              {(postText.trim() || fileContent) && (
                <button className={styles.postButton} onClick={handleUpload}>
                  Post
                </button>
              )}
            </div>
          </div>

          <div className={styles.postContainer}>
            {postState.posts.map((post) => {
              return (
                <div key={post._id} className={styles.singleCard}>
                  {/* HEADER */}
                  <div className={styles.postHeader}>
                    <img
                      src={`${Base_url}/uploads/${post?.userId?.profilePicture}`}
                      className={styles.postProfile}
                    />

                    <div className={styles.userInfo}>
                      <div className={styles.nameRow}>
                        <h4>{post.userId?.name}</h4>

                        <span className={styles.postDate}>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <p>@{post.userId?.username}</p>
                    </div>

                    {/* DELETE ICON */}
                    {post.userId?._id === authState.user?.userId?._id && (
                      <div
                        className={styles.deleteIcon}
                        onClick={async () => {
                          await dispatch(deletePost({ postId: post._id }));
                          await dispatch(getAllPosts());
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className={styles.trashIcon}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* POST BODY */}
                  <div className={styles.postBody}>
                    <p>{post.body}</p>

                    {post.media && (
                      <img
                        src={`${Base_url}/uploads/${post.media}`}
                        className={styles.postImage}
                      />
                    )}
                  </div>

                  {/* ACTIONS */}
                  <div className={styles.postActions}>
                    <button
                      type="button"
                      className={`${styles.actionBtn} ${styles.likeBtn}`}
                      onClick={async () => {
                        await dispatch(incrementLikes(post._id));
                        await dispatch(getAllPosts());
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={styles.actionIcon}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                        />
                      </svg>

                      <span>Like</span>
                      <p>{post.likes}</p>
                    </button>

                    <button
                      type="button"
                      className={`${styles.actionBtn} ${styles.commentBtn}`}
                      onClickCapture={() => {
                        dispatch(getAllComments({ postId: post._id }));
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={styles.actionIcon}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                        />
                      </svg>

                      <span>Comment</span>
                    </button>

                    <button
                      type="button"
                      className={`${styles.actionBtn} ${styles.shareBtn}`}
                      onClick={() => {
                        const text = encodeURIComponent(post.body);
                        const url = `https://twitter.com/intent/tweet?text=${text}`;
                        window.open(url, "_blank");
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className={styles.actionIcon}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                        />
                      </svg>

                      <span>Share</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          {postState.postId !== "" && (
            <div
              onClick={() => dispatch(resetPostId())}
              className={styles.commentsContainer}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                className={styles.allCommentsContainer}
              >
                {/* HEADER */}
                <div className={styles.commentsHeader}>
                  <h3>Comments</h3>
                </div>

                {/* COMMENTS LIST */}
                <div className={styles.commentsList}>
                  {!postState.comments.comments ||
                    postState.comments.comments.length === 0 ? (
                    <p className={styles.noComments}>No comments yet</p>
                  ) : (
                    postState.comments.comments.map((comment, key) => (
                      <div key={key} className={styles.singleComment}>
                        <img
                          src={`${Base_url}/uploads/${comment.userId?.profilePicture}`}
                          className={styles.commentProfile}
                          alt="profile"
                        />

                        <div className={styles.commentContent}>
                          <span className={styles.commentUsername}>
                            @{comment.userId?.username}
                          </span>

                          <span className={styles.commentText}>
                            {comment.comment}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {/* INPUT */}
                <div className={styles.postCommentContainer}>
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                  />

                  <div
                    onClick={async () => {
                      if (!commentText.trim()) return;

                      await dispatch(
                        postComment({
                          postId: postState.postId,
                          body: commentText,
                        }),
                      );

                      await dispatch(
                        getAllComments({ postId: postState.postId }),
                      );
                      setCommentText("");
                    }}
                    className={styles.postCommentContainer_commentBtn}
                  >
                    Post
                  </div>
                </div>
              </div>
            </div>
          )}
        </DashboardLayout>
      </UserLayout>
    );
  } else {
    return (
      <UserLayout>
        <DashboardLayout>
          <div className="scrollComponent">
            <div className={styles.createPostContainer}>
              <p>Loading....</p>
            </div>
          </div>
        </DashboardLayout>
      </UserLayout>
    );
  }
};

export default Dashboard;
