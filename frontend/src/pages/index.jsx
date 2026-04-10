import styles from "@/styles/Home.module.css";
import Image from "next/image";
import { useRouter } from "next/router";
import UserLayout from "../layout/userLayout";

export default function Home() {
  const router = useRouter();
  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.hero}>
          <div className={styles.left}>
            <h1>
              Connect With Friends <br />
              <span>Without Exaggeration</span>
            </h1>

            <p>
              A true social media platform where people share real stories, real
              moments and genuine connections. No fake highlights.
            </p>

            <div className={styles.buttons}>
              <button
                onClick={() => router.push("/login")}
                className={styles.primaryBtn}
              >
                Join Now
              </button>
            </div>
          </div>

          <div className={styles.right}>
            <img src="/images/32.png" width={720} height={500} alt="social" />
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
