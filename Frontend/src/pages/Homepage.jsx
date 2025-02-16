import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import cookie from "js-cookie";
import PrimaryServices from "../Services/PrimaryServices";

export default function Homepage() {
  const primaryService = new PrimaryServices();
  const [loading, setLoading] = useState(false);

  const logout_handler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = cookie.get("token");
    const navigate = useNavigate();

    const response = await primaryService.LogOut(token); // main service

    // if the response is success, remove the cookie and the navigate the user to the signin page
    if (response) {
      cookie.remove("token");
      setLoading(false);
      navigate("/");
      console.log(response?.data?.message);
    } else {
      setLoading(false);
      console.log(response?.message);
    }
  };
  return (
    <>
      <div>This is a homepage</div>
      <form onSubmit={logout_handler}>
        <button type="submit" className="border mt-1 p-1">
          {loading ? "Loging out..." : "Log out"}
        </button>
      </form>
    </>
  );
}
