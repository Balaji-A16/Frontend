import { useEffect } from "react";
import Page from "../../components/Page";
import { convertStyleToReact } from "../../utils/helper.function";
import "./home.css";
import { useAppSelector } from "src/redux/hooks";
import { orderBy } from "lodash";
import PostComponent from "components/PostComponent";
import CreatePostComponent from "components/CreatePostComponent";

export default function Home() {
  const { posts } = useAppSelector((state) => ({
    posts: state.posts.posts,
  }));
  useEffect(() => {
    convertStyleToReact(
      "border-bottom-width: 1px;border-bottom-color: var(--bs-navbar-active-color);"
    );
  }, []);
  return (
    <Page title="Home">
      <div className="container">
        <div
          className="row justify-center"
          style={{ maxWidth: 600, margin: "auto" }}
        >
          <CreatePostComponent />
          {orderBy(posts, "timestamp", "desc").map((post) => (
            <PostComponent key={post._id} {...post} />
          ))}
          {posts.length === 0 && (
            <div className="mt-4">
              <h1>No posts found</h1>
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}
