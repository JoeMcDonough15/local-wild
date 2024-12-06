import { useAppSelector } from "../../store";
import EditProfileForm from "../EditProfileForm/EditProfileForm";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import "./UserProfilePage.css";

const UserDetails = () => {
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const sessionUser = useAppSelector((state) => state.session.sessionUser);
  const allPostsByUser = useAppSelector((state) => state.posts.allPosts);

  if (!currentUser || !sessionUser) return <></>;

  const { name, location, aboutMe, profileImageUrl } = currentUser;

  return (
    <div className="user-details flex-col">
      <div className="name-and-avatar flex-row">
        <h2 className="username">{name}</h2>
        {profileImageUrl && (
          <div className="user-avatar-container">
            <img className="user-avatar" src={profileImageUrl} alt="" />
          </div>
        )}
        {sessionUser.id === Number(currentUser.id) && (
          <OpenModalButton
            buttonText="Edit Profile"
            classes="edit-profile-button"
            modalComponent={<EditProfileForm />}
          />
        )}
      </div>
      <div className="details flex-col">
        {location && <p className="location">{location}</p>}
        {aboutMe && <p className="about-me">{aboutMe}</p>}
        {allPostsByUser.length > 0 && (
          <p className="num-posts">
            {name} has posted {allPostsByUser.length} times!
          </p>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
