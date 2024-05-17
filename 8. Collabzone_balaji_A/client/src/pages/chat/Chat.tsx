import Page from "components/Page";
import { get } from "lodash";
import moment from "moment";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import {
  convertFileToDataURL,
  convertStyleToReact,
} from "utils/helper.function";
import { Icon } from "@iconify/react";
import axios from "axios";
import { setSnack } from "src/redux/reducers/snack.reducer";
import { Modal } from "react-bootstrap";
/* eslint-disable @typescript-eslint/no-explicit-any */

export default function Chat() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [activeUser, setActiveUser] = useState("");
  const [showMediaDialog, setShowMediaDialog] = useState(false);
  const { user, socket, chats } = useAppSelector((state) => ({
    user: state.auth.user,
    chats: state.chats.chats,
    socket: state.socket.socket,
  }));

  const [chatMessage, setChatMessage] = useState("");
  const [media, setMedia] = useState<any>(null);

  const handleActiveUser = async (email: string) => {
    setActiveUser(email);
    navigate(`/chat?selected=${email}`);
    if (socket) {
      socket.emit("get-messages-request", {
        sender: user?.email,
        receiver: email,
      });
    }
  };

  async function handleChatMessage(data: any) {
    let chatObj: any = {
      sender: user?.email,
      receiver: activeUser,
      message: data,
      type: "text",
    };
    if (media) {
      chatObj = {
        ...chatObj,
        media: {
          type: media?.type,
          file: media?.file,
          name: media?.file?.name,
        },
        type: media?.type?.includes("image")
          ? "image"
          : media?.type?.includes("video")
          ? "video"
          : "text",
      };
      try {
        const formData = new FormData();
        formData.append("file", media.file);
        const backendServer = `${import.meta.env.VITE_express_server}`;
        const { data } = await axios.post(`${backendServer}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        chatObj = {
          ...chatObj,
          type: media.type,
          media: data.fileUrl,
        };
      } catch (error: any) {
        dispatch(
          setSnack({ type: "error", message: error.message, open: true })
        );
      }
    }
    socket?.emit("send-message-request", chatObj);
    setChatMessage("");
    setShowMediaDialog(false);
    setMedia(null);
  }
  console.log(chats);
  return (
    <Page
      title="chat"
      style={{ marginTop: 0, minHeight: "calc(100vh - 180px)" }}
    >
      <Modal
        maxWidth="sm"
        fullWidth
        show={showMediaDialog}
        onHide={() => {
          setShowMediaDialog(false);
          setMedia(null);
        }}
      >
        <Modal.Header>
          <Modal.Title>Upload media</Modal.Title>
        </Modal.Header>
        {media && (
          <>
            {media.type.includes("image") ? (
              <img src={media.url} width="100%" height={300} />
            ) : (
              <video src={media.url} width="100%" height={300} controls></video>
            )}
          </>
        )}
        <input
          className="form-control p-3"
          id="textAreaExample2"
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleChatMessage(get(e, "target.value", ""));
            }
          }}
          placeholder="Type a message"
        />
      </Modal>
      <section>
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-lg-5 col-xl-4">
              <div className="card">
                <div className="card-body">
                  <ul className="list-unstyled mb-0">
                    {user &&
                      user.friends.map((friend) => (
                        <li
                          onClick={() => handleActiveUser(friend.email)}
                          className="p-2 border-bottom"
                          style={convertStyleToReact(
                            "background-color: #eee;cursor:pointer;"
                          )}
                        >
                          <div className="d-flex flex-row">
                            <img
                              src={friend.photoURL}
                              alt="avatar"
                              className=""
                              style={{
                                minHeight: 55,
                                borderRadius: "50%",
                                maxHeight: 55,
                                marginRight: 8,
                                maxWidth: 55,
                              }}
                            />
                            <div className="pt-1">
                              <p className="fw-bold mb-0">
                                {friend.displayName}
                              </p>
                              <p className="small text-muted">{friend.email}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>

            <div
              className={`col-md-6 col-lg-7 col-xl-8 ${
                !activeUser && "d-none"
              }`}
            >
              <ul
                className="list-unstyled"
                style={{
                  maxHeight: "75vh",
                  overflowY: "auto",
                }}
              >
                {chats.map((chat) => {
                  const friend = user?.friends.find(
                    (item) => item.email === chat.sender
                  );
                  return (
                    <li className="d-flex justify-content-between mb-4">
                      {chat.sender === user?.email ? (
                        <div className="d-flex" style={{}}>
                          <img
                            src={user?.photoURL}
                            alt="avatar"
                            className="me-3 shadow-1-strong"
                            width="60"
                            style={{ borderRadius: "50%", maxHeight: 60 }}
                          />
                          <div className="card">
                            <div className="card-header d-flex justify-content-between p-3">
                              <p
                                className="fw-bold mb-0"
                                style={{ marginRight: 8 }}
                              >
                                YOU
                              </p>
                              <p className="text-muted small mb-0">
                                <Icon icon="ph:clock-light" />{" "}
                                {moment(get(chat, "timestamp")).fromNow()}
                              </p>
                            </div>
                            <div className="card-body">
                              {chat.media && chat.type.includes("image") && (
                                <img
                                  style={{
                                    width: 200,
                                    height: 200,
                                    objectFit: "cover",
                                  }}
                                  src={chat.media}
                                  alt={chat.message}
                                />
                              )}
                              <p className="mb-0">{chat.message}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div
                          className="d-flex border-1"
                          style={{ marginLeft: "auto" }}
                        >
                          <div
                            className="card w-100"
                            style={{ marginRight: 12 }}
                          >
                            <div className="card-header d-flex justify-content-between p-3">
                              <p className="fw-bold mb-0">
                                {get(friend, "displayName")}
                              </p>
                              <p className="text-muted small mb-0">
                                <Icon icon="ph:clock-light" />{" "}
                                {moment(get(chat, "timestamp")).fromNow()}
                              </p>
                            </div>
                            <div className="card-body">
                              <p className="mb-0">{chat.message}</p>
                            </div>
                          </div>
                          <img
                            src={friend?.photoURL}
                            alt="avatar"
                            className="me-3 shadow-1-strong"
                            width="60"
                            style={{ borderRadius: "50%", maxHeight: 60 }}
                          />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div className="form-outline">
                <input
                  type="file"
                  ref={photoInputRef}
                  accept="image/*"
                  style={{ display: "none" }}
                  id="image"
                  onChange={async (e) => {
                    const file: any = get(e, "target.files[0]", null);
                    if (file) {
                      const url = await convertFileToDataURL(file);
                      setMedia({
                        url,
                        type: file.type,
                        file,
                      });
                      setShowMediaDialog(true);
                    }
                  }}
                />
                <input
                  type="file"
                  ref={videoInputRef}
                  accept="video/*"
                  style={{ display: "none" }}
                  id="video"
                  onChange={async (e) => {
                    const file: any = get(e, "target.files[0]", null);
                    try {
                      if (file) {
                        const url = await convertFileToDataURL(file);
                        setMedia({
                          url,
                          type: file.type,
                          file,
                        });
                        setShowMediaDialog(true);
                      }
                    } catch (error: any) {
                      console.log(error.message);
                    }
                  }}
                  onAbort={(e) => {
                    console.log(e);
                  }}
                />
                <div className="d-flex mb-2">
                  <button
                    className="border-0"
                    onClick={() => videoInputRef.current?.click()}
                  >
                    <Icon style={{ fontSize: 24 }} icon="mingcute:video-fill" />
                  </button>
                  <button
                    className="border-0 ms-2"
                    onClick={() => photoInputRef.current?.click()}
                  >
                    <Icon style={{ fontSize: 24 }} icon="ic:outline-image" />
                  </button>
                </div>
                <input
                  className="form-control p-3"
                  id="textAreaExample2"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleChatMessage(get(e, "target.value", ""));
                    }
                  }}
                  placeholder="Type a message"
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
              className={`${!activeUser ? "d-flex" : "d-none"}`}
            >
              <h5>Select a user to start chat</h5>
            </div>
          </div>
        </div>
      </section>
    </Page>
  );
}
