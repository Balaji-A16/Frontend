/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { Button } from "react-bootstrap";
import { firebaseAuth } from "src/service/firebase";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "src/redux/hooks";
import { setSnack } from "src/redux/reducers/snack.reducer";

export interface PasswordState {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

function LoginForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  async function handleLogin(user: any) {
    const accessToken = await user.getIdToken();
    localStorage.setItem("time", new Date().toISOString());
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", user.refreshToken);
    localStorage.setItem("email", `${user.email}`);
    localStorage.setItem("name", `${user.displayName}`);
    localStorage.setItem("userId", user.uid);
    navigate("/", { replace: true });

  }

  async function handleGoogleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;
      await handleLogin(user);
    } catch (error: any) {
      dispatch(setSnack({ message: error.message, type: "error", open: true }));
    }
  }

  return (
    <div
      style={{
        maxWidth: 420,
        fontWeight: 400,
        background: "white",
        padding: 32,
        borderRadius: 16,
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
        textAlign: "center",
      }}
    >
      <h4>{import.meta.env.VITE_APP_NAME}</h4>
      <h6>Login to continue</h6>
      <Button className="mt-2" onClick={handleGoogleSignIn}>
        Continue with Google
      </Button>
    </div>
  );
}

export default LoginForm;
