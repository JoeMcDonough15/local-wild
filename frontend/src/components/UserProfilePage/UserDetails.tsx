import { useAppSelector } from "../../store";

const UserDetails = () => {
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const totalNumPostsByUser = useAppSelector(
    (state) => state.posts.totalNumPosts
  );

  if (!currentUser) return <></>;

  const { username, favoriteSubject, location, numYearsExperience } =
    currentUser;

  return (
    <section className="user-details">
      <div className="name-and-avatar flex-row">
        {currentUser.profileImageUrl && (
          <div className="user-avatar container">
            <img src={currentUser.profileImageUrl} alt="" />
          </div>
        )}
        <h2>{username}</h2>
      </div>
      <div className="details">
        {favoriteSubject && <p> {favoriteSubject}</p>}
        {location && <p>{location}</p>}
        {numYearsExperience && <p>{numYearsExperience}</p>}
        {totalNumPostsByUser && (
          <p>
            {username} has posted {totalNumPostsByUser} times!
          </p>
        )}
      </div>
    </section>
  );
};

export default UserDetails;
