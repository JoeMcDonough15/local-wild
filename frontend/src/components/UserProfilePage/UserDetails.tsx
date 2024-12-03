import { useAppSelector } from "../../store";
import "./UserProfilePage.css";

const UserDetails = () => {
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const totalNumPostsByUser = useAppSelector(
    (state) => state.posts.totalNumPosts
  );

  if (!currentUser) return <></>;

  const { username, location, aboutMe } = currentUser;

  return (
    <div className="user-details flex-row">
      <div className="name-and-avatar flex-row">
        <h2 className="username">{username}</h2>
        {currentUser.profileImageUrl && (
          <div className="user-avatar-container">
            <img
              className="user-avatar"
              src={currentUser.profileImageUrl}
              alt=""
            />
          </div>
        )}
      </div>
      <div className="details">
        {location && <p>{location}</p>}
        {aboutMe && <p>{aboutMe}</p>}
        {totalNumPostsByUser && (
          <p>
            {username} has posted {totalNumPostsByUser} times!
          </p>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
