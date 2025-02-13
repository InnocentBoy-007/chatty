import React from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();

  return (
    <>
      <>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md w-96">
            <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
            <form>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="username"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  //   value={userData.username}
                  //   onChange={(e) =>
                  //     setUserData((prevUserData) => ({
                  //       ...prevUserData,
                  //       username: e.target.value,
                  //     }))
                  //   }
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  //   value={userData.email}
                  //   onChange={(e) =>
                  //     setUserData((prevUserData) => ({
                  //       ...prevUserData,
                  //       email: e.target.value,
                  //     }))
                  //   }
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="address"
                >
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  //   value={userData.address}
                  //   onChange={(e) =>
                  //     setUserData((prevUserData) => ({
                  //       ...prevUserData,
                  //       address: e.target.value,
                  //     }))
                  //   }
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  //   value={userData.password}
                  //   onChange={(e) =>
                  //     setUserData((prevUserData) => ({
                  //       ...prevUserData,
                  //       password: e.target.value,
                  //     }))
                  //   }
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="confirmpassword"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  //   value={userData.confirmPassword}
                  //   onChange={(e) =>
                  //     setUserData((prevUserData) => ({
                  //       ...prevUserData,
                  //       confirmPassword: e.target.value,
                  //     }))
                  //   }
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="phoneNo"
                >
                  Phone
                </label>
                <input
                  type="text"
                  id="phoneNo"
                  //   value={userData.phoneNo}
                  //   onChange={(e) =>
                  //     setUserData((prevUserData) => ({
                  //       ...prevUserData,
                  //       phoneNo: e.target.value,
                  //     }))
                  //   }
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <div className="mt-1">
                  <label className="inline-flex items-center mr-4">
                    <input
                      type="radio"
                      value="male"
                      //   checked={userData.gender === "male"}
                      //   onChange={(e) =>
                      //     setUserData((prevUserData) => ({
                      //       ...prevUserData,
                      //       gender: e.target.value,
                      //     }))
                      //   }
                      className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                      required
                    />
                    <span className="ml-2">Male</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      value="female"
                      //   checked={userData.gender === "female"}
                      //   onChange={(e) =>
                      //     setUserData((prevUserData) => ({
                      //       ...prevUserData,
                      //       gender: e.target.value,
                      //     }))
                      //   }
                      className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
                      required
                    />
                    <span className="ml-2">Female</span>
                  </label>
                  {/* Add more options as needed */}
                </div>
              </div>
              <div className="mb-4">
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="age"
                >
                  Age
                </label>
                <input
                  type="text"
                  id="age"
                  //   value={userData.age}
                  //   onChange={(e) =>
                  //     setUserData((prevUserData) => ({
                  //       ...prevUserData,
                  //       age: e.target.value,
                  //     }))
                  //   }
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
              >
                Sign up
                {/* {laoding ? "signing up..." : "sign up"} */}
              </button>
            </form>
            <p className="text-sm text-gray-500 mt-5">
              Already have an account?{" "}
              <span
                className="font-bold cursor-pointer"
                onClick={() => navigate("/")}
              >
                Sign In
              </span>
            </p>
          </div>
        </div>
      </>
    </>
  );
}
