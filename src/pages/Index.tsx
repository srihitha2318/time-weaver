import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Landing from "./Landing";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("timetrack_user");
    if (user) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return <Landing />;
};

export default Index;
