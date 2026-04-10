import React from 'react'
import styles from './styles.module.css'
import { useRouter } from "next/router";
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedIN, setTokenIsThere } from '@/src/config/redux/reducer/authReducer';
import { Base_url } from '@/src/config';

const Navbar = () => {

  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const user = authState?.user?.userId;

  return (
    <nav className={styles.navbar}>

      {/* Logo */}
      <div onClick={() => router.push("/")} className={styles.logo}>
        LinkForge
      </div>

      {authState?.profileFetch && user ? (
        <div className={styles.userSection}>
          
          <p>{user?.username}</p>

          <img
            src={`${Base_url}/uploads/${user?.profilePicture}`}
            alt="my-profile"
            className={styles.avatar}
            onClick={() => router.push("/profile")}
          />

          <button
            className={styles.logoutBtn}
            onClick={() => {
              localStorage.removeItem("token");
              dispatch(setTokenIsThere(false));
              dispatch(setLoggedIN());
              router.push("/login");
            }}
          >
            Logout
          </button>

        </div>
      ) : (
        <button
          onClick={() => router.push("/login")}
          className={styles.joinBtn}
        >
          Be a Part
        </button>
      )}

    </nav>
  )
}

export default Navbar