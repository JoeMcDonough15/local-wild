import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store";
import { useEffect } from "react";
import { getUserThunk } from "../../store/slices/userSlice";
import "./MyPostsPage.css";
import PostsList from "../PostsList";

const MyPostsPage = (): JSX.Element => {
  const sessionUser = useAppSelector((state) => state.session.sessionUser);
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionUser) return;
    // sets the currentUser and also gets all the posts associated with logged in user
    dispatch(getUserThunk(sessionUser.id));
  }, [dispatch, sessionUser]);

  if (!sessionUser) {
    navigate("/#skip-intro");
    return <></>;
  }

  if (!currentUser) {
    return <></>;
  }

  return (
    <section className="my-posts-page flex-row">
      <PostsList />
    </section>
  );
};

export default MyPostsPage;
