import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import cookie from "js-cookie";
import primaryServices from "../Services/PrimaryServices";

export default function Homepage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const logout_handler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = cookie.get("token");

    const response = await primaryServices.LogOut(token); // main service

    // if the response is success, remove the cookie and the navigate the user to the signin page
    if (response.success) {
      cookie.remove("token");
      window.alert(response?.data?.message);
      setLoading(false);
      navigate("/");
    } else {
      window.alert(response?.data?.message);
      setLoading(false);
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
