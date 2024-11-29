import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store";
import DisplayPosts from "../DisplayPosts";
import { useEffect } from "react";
import { userSlice } from "../../store/slices/userSlice";

const MyPostsPage = (): JSX.Element => {
  const sessionUser = useAppSelector((state) => state.session.sessionUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionUser) return;
    dispatch(userSlice.actions.setCurrentUser(sessionUser));
  }, [dispatch, sessionUser]);

  if (!sessionUser) {
    navigate("/");
    return <></>;
  }
  return (
    <section>
      <DisplayPosts listOrCarousel="list" postsPerPageOrSlide={10} />;
    </section>
  );
};

export default MyPostsPage;
