import { useState } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        console.log("Account created:", result.user);
      })
      .catch((err) => console.error(err.message));
  };

  return (
    <div>
      <h1>Signup</h1>
      <input onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
      <button onClick={handleSignup}>Create Account</button>
    </div>
  );
}
