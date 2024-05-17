import axios from "axios";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { setUser } from "src/redux/reducers/auth.reducer";
import { setSnack } from "src/redux/reducers/snack.reducer";
import { convertStyleToReact } from "utils/helper.function";
import { useForm, Controller } from "react-hook-form";
import { setProfile } from "src/redux/reducers/profile.reducer";
import { Button } from "react-bootstrap";
/* eslint-disable @typescript-eslint/no-explicit-any */

export default function Profile() {
  const params = useParams();
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const { socket, user, profileData } = useAppSelector((state) => ({
    socket: state.socket.socket,
    user: state.auth.user,
    profileData: state.profile.data,
  }));

  const { control, getValues, setValue } = useForm({
    defaultValues: {
      displayName: "",
      email: "",
      phoneNumber: "",
      dob: new Date(),
      address: "",
    },
  });

  async function saveProfile() {
    const values = getValues();
    const obj = { ...values, _id: profileData?._id };
    socket?.emit("update-profile", obj);
    dispatch(setProfile(obj));
  }

  async function handleFileUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) {
    try {
      if (e.target.files) {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        const { data } = await axios.post(
          `${import.meta.env.VITE_express_server}/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const obj = {
          ...profileData,
          [type]: data.fileUrl,
        };
        socket?.emit("update-profile", obj);
        dispatch(setProfile(obj));
        dispatch(
          setUser({
            ...user,
            [type]: data.fileUrl,
          })
        );
      }
    } catch (error: any) {
      dispatch(setSnack({ open: true, message: error.message, type: "error" }));
    }
  }
  useEffect(() => {
    if (socket && user?._id && !profileData) {
      const tempId = params.id || user?._id;
      socket.emit("get-profile-request", tempId);
    }
    if (profileData) {
      setValue("displayName", profileData.displayName);
      setValue("email", profileData.email);
      setValue("phoneNumber", profileData.phoneNumber);
      setValue("dob", new Date(profileData.dob));
      setValue("address", profileData.address);
    }
  }, [
    params.id,
    socket,
    user?._id,
    dispatch,
    user?.email,
    profileData,
    setValue,
  ]);
  return (
    <div
      className="container"
      style={convertStyleToReact(
        "display: flex;text-align: center;justify-content: center;"
      )}
    >
      <input
        ref={coverInputRef}
        type="file"
        hidden
        accept="image/*"
        onChange={(e) => handleFileUpload(e, "cover")}
      />
      <input
        ref={profileInputRef}
        type="file"
        hidden
        accept="image/*"
        onChange={(e) => handleFileUpload(e, "photoURL")}
      />
      <div className="container">
        <div className="row gutters">
          <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
            <div className="card h-100">
              <div className="card-body">
                <div className="account-settings">
                  <div className="user-profile">
                    <div className="user-avatar">
                      <img
                        src={profileData?.photoURL}
                        alt={profileData?.displayName}
                      />
                    </div>
                    <Button
                      onClick={() => profileInputRef.current?.click()}
                      className="mb-4"
                    >
                      Update Profile Pic
                    </Button>
                    <h5 className="user-name">{profileData?.displayName}</h5>
                    <h6 className="user-email">{profileData?.email}</h6>
                  </div>
                  <div className="about">
                    <h5>About</h5>
                    <p>
                      I'm Yuki. Full Stack Designer I enjoy creating
                      user-centric, delightful and human experiences.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
            <div className="card h-100">
              <div className="card-body">
                <div className="row gutters">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <h6 className="mb-2 text-primary">Personal Details</h6>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group text-start">
                      <label htmlFor="fullName">Full Name</label>
                      <Controller
                        name="displayName"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="text"
                            className="form-control"
                            id="fullName"
                            placeholder="Enter full name"
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12 mb-3">
                    <div className="form-group text-start">
                      <label htmlFor="eMail">Email</label>
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="email"
                            className="form-control"
                            id="email"
                            placeholder="Enter email"
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group text-start">
                      <label htmlFor="phone">Phone</label>
                      <Controller
                        name="phoneNumber"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="phone"
                            className="form-control"
                            id="phoneNumber"
                            placeholder="Enter phone number"
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                    <div className="form-group text-start">
                      <label htmlFor="website">Address</label>
                      <Controller
                        name="address"
                        control={control}
                        render={({ field }) => (
                          <input
                            type="text"
                            className="form-control"
                            id="address"
                            placeholder="Enter Address"
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="row gutters">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                    <div className="text-right mt-5">
                      {/* <button
                        type="button"
                        id="submit"
                        name="submit"
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button> */}
                      <button
                        onClick={saveProfile}
                        type="button"
                        id="submit"
                        name="submit"
                        className="btn btn-primary ms-2"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
