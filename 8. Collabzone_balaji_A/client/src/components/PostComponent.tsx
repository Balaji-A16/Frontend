import { get, orderBy } from "lodash";
import { PostType } from "utils/types/post.types";
import moment from "moment";
import Accordion from "react-bootstrap/Accordion";
import { Icon } from "@iconify/react";
import { useAppSelector } from "src/redux/hooks";
import { useState } from "react";
import CommentDialog from "./CommentDialog";
/* eslint-disable @typescript-eslint/no-explicit-any */

export default function PostComponent(props: PostType) {
  const { user, socket } = useAppSelector((state) => ({
    user: state.auth.user,
    socket: state.socket.socket,
  }));

  const [comment, setComment] = useState("");
  const [showCommentDialog, setShowCommentDialog] = useState(false);

  return (
    <div className="col-sm-12">
      <CommentDialog
        _id={props._id}
        value={comment}
        onChange={(value) => setComment(value)}
        show={showCommentDialog}
        onClose={setShowCommentDialog}
      />
      <div className="panel panel-white post">
        <div className="post-heading d-flex">
          <div className="pull-left image">
            <img
              src={get(props, "owner.photoURL")}
              className="img-circle avatar"
              alt="user profile image"
            />
          </div>
          <div className="pull-left meta">
            <div className="title h5">{get(props, "owner.displayName")}</div>
            <h6 className="text-muted time">
              {moment(get(props, "timestamp")).fromNow()}
            </h6>
          </div>
        </div>
        <div className="post-image mt-5">
          {props.type === "image" && (
            <img src={props.content} className="image" alt="image post" />
          )}
          {props.type === "text" && (
            <h1 className="text-center">{props.content}</h1>
          )}
        </div>
        <div className="post-description mt-4">
          {props.type !== "text" && (
            <h6 className="px-2, py-1">{props.text}</h6>
          )}
          <div className="stats">
            <button
              style={{ border: "none", marginLeft: 8, padding: 8 }}
              onClick={() => {
                if (props.likes?.includes(user._id)) {
                  socket?.emit("unlike-post", {
                    post_id: props._id,
                    user_id: user._id,
                  });
                } else {
                  socket?.emit("like-post", {
                    post_id: props._id,
                    user_id: user._id,
                  });
                }
              }}
            >
              {props.likes.includes(user._id) ? (
                <Icon
                  icon="mdi:like"
                  style={{ fontSize: 20, color: " #17A9FD" }}
                />
              ) : (
                <Icon icon="ei:like" style={{ fontSize: 26 }} />
              )}
              {props.likes.length} Likes
            </button>
            <button
              onClick={() => setShowCommentDialog(true)}
              style={{ border: "none", marginLeft: 8, padding: 8 }}
            >
              <Icon
                icon="teenyicons:chat-outline"
                style={{ fontSize: 16, marginRight: 8 }}
              />
              {props.comments.length} Comments
            </button>
          </div>
        </div>
        <Accordion style={{ border: "none" }}>
          <Accordion.Item eventKey="0" style={{ border: "none" }}>
            <Accordion.Header>Comments</Accordion.Header>
            <Accordion.Body>
              <div className="post-footer">
                <div className="input-group">
                  <input
                    className="form-control"
                    placeholder="Add a comment"
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button
                    className="b-none border-0"
                    style={{ borderRadius: "0px 4px 4px 0px" }}
                    onClick={() => {
                      socket?.emit("comment-post", {
                        post_id: props._id,
                        user_id: user._id,
                        text: comment,
                      });
                      setComment("");
                    }}
                  >
                    Submit
                  </button>
                </div>
                <ul className="comments-list">
                  {orderBy(props.comments, "timestamp", "desc").map(
                    (comment, index) => (
                      <li className="comment" key={index}>
                        <div className="d-flex">
                          <img
                            className="avatar"
                            src={get(comment, "user.photoURL")}
                            alt="avatar"
                          />
                          <div
                            className="comment-heading"
                            style={{ marginLeft: 8 }}
                          >
                            <h4 className="user">
                              {get(comment, "user.displayName")}
                            </h4>
                            <h5 className="time">
                              {moment(get(comment, "timestamp")).fromNow()}
                            </h5>
                          </div>
                        </div>
                        <div className="comment-body">
                          <p>{comment.text}</p>
                        </div>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
}
