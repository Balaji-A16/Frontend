import { Button } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { setSnack } from "src/redux/reducers/snack.reducer";
import { convertStyleToReact } from "utils/helper.function";

export default function Friends() {
  const dispatch = useAppDispatch();
  const { user, socket } = useAppSelector((state) => ({
    user: state.auth.user,
    socket: state.socket.socket,
  }));
  return (
    <div className="container">
      <div className="card overflow-hidden">
        <div className="card-body p-0">
          <img
            src={
              user?.cover ||
              "https://www.bootdey.com/image/1352x300/6495ED/000000"
            }
            alt=""
            className="img-fluid"
          />
          <div className="row align-items-center pb-4">
            <div className="col-lg-4 mt-n3 order-lg-2 order-1 mx-auto">
              <div className="mt-n5">
                <div className="d-flex align-items-center justify-content-center mb-2">
                  <div
                    className="linear-gradient d-flex align-items-center justify-content-center rounded-circle"
                    style={convertStyleToReact("width: 110px; height: 110px;")}
                  >
                    <div
                      className="border border-4 border-white d-flex align-items-center justify-content-center rounded-circle overflow-hidden"
                      style={convertStyleToReact(
                        "width: 100px; height: 100px;"
                      )}
                    >
                      <img
                        src={user?.photoURL}
                        alt=""
                        className="w-100 h-100"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <h5 className="fs-5 mb-0 fw-semibold">{user?.displayName}</h5>
                  <p className="mb-0 fs-4">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tab-content" id="pills-tabContent">
        <div
          className="tab-pane fade show active"
          id="pills-friends"
          role="tabpanel"
          aria-labelledby="pills-friends-tab"
          tabIndex={0}
        >
          <div className="d-sm-flex align-items-center justify-content-between mt-3 mb-4">
            <h3 className="mb-3 mb-sm-0 fw-semibold d-flex align-items-center">
              Friends{" "}
              <span className="badge text-bg-secondary fs-2 rounded-4 py-1 px-2 ms-2">
                {user?.friends.length}
              </span>
            </h3>
            <form className="position-relative">
              <input
                type="text"
                className="form-control search-chat py-2 ps-5"
                id="text-srh"
                placeholder="Search Friends"
              />
              <i className="ti ti-search position-absolute top-50 start-0 translate-middle-y text-dark ms-3"></i>
            </form>
          </div>
          <div className="row">
            {user?.requests.map((friend, index) => (
              <div className="col-sm-6 col-lg-4" key={index}>
                <div className="card hover-img">
                  <div className="card-body p-4 text-center">
                    <img
                      src={
                        friend.photoURL ||
                        "https://bootdey.com/img/Content/avatar/avatar1.png"
                      }
                      alt=""
                      className="mb-3"
                      width="80"
                      height="80"
                      style={{ objectFit: "cover", borderRadius: "50%" }}
                    />
                    <h5 className="fw-semibold mb-0">{friend.displayName}</h5>
                    <span className="h6">{friend.email}</span>
                    <br />
                    <div
                      className="d-flex"
                      style={{ justifyContent: "center" }}
                    >
                      <Button
                        onClick={() => {
                          const obj = {
                            receiver: user?._id,
                            sender: friend._id,
                          };
                          socket?.emit("accept-friend-request", obj);
                          dispatch(
                            setSnack({
                              open: true,
                              message: "Friend request accepted",
                              type: "success",
                            })
                          );
                        }}
                        className="mt-2"
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() => {
                          const obj = {
                            receiver: user?._id,
                            sender: friend._id,
                          };
                          socket?.emit("reject-friend-request", obj);
                          dispatch(
                            setSnack({
                              open: true,
                              message: "Friend request rejected",
                              type: "error",
                            })
                          );
                        }}
                        className="mt-2 ms-2"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {user?.friends.map((friend, index) => (
              <div className="col-sm-6 col-lg-4" key={index}>
                <div className="card hover-img">
                  <div className="card-body p-4 text-center">
                    <img
                      src={
                        friend.photoURL ||
                        "https://bootdey.com/img/Content/avatar/avatar1.png"
                      }
                      alt=""
                      className="mb-3"
                      width="80"
                      height="80"
                      style={{ objectFit: "cover", borderRadius: "50%" }}
                    />
                    <h5 className="fw-semibold mb-0">{friend.displayName}</h5>
                    <span className="h6">{friend.email}</span>
                    <br />
                    <Button
                      onClick={() => {
                        socket?.emit("unfriend-user", {
                          receiver: user?._id,
                          sender: friend._id,
                        });
                      }}
                      className="mt-2"
                    >
                      Unfriend
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
