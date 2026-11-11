import { useSelector } from "react-redux";
import { RootState } from "../../../../redux/config";

/**
 * Top bar of the admin section.
 *
 * The name and the email come from the profile of the signed in user so the
 * header does not show a hardcoded account.
 */
const HeaderAdmin = () => {
  const profile = useSelector((state: RootState) => state.user.profile);

  return (
    <div className="flex items-center justify-between p-4 ">
      <div className="hidden sm:block">
        <p className="text-gray-500 text-base">Good Morning,</p>
        <h1 className="text-2xl font-semibold mt-2">
          {profile?.fullName || profile?.username || "Admin"}
        </h1>
      </div>

      <div className="flex items-center ml-auto">
        <div className="hidden md:flex items-center">
          <button className="p-4 rounded-full bg-white ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
          </button>
          <button className="p-4 rounded-full bg-white ml-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
              />
            </svg>
          </button>
          <button className="p-4 rounded-full bg-white ml-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center space-x-2 bg-white rounded-full p-2 ml-2">
          <img
            className="w-10 h-10 rounded-full object-cover"
            src={profile?.avatarUrl || "/image/avatar.jpg"}
            alt="Profile"
          />
          <div className="hidden sm:block">
            <p className="font-semibold text-base">
              {profile?.fullName || profile?.username || "Admin"}
            </p>
            <p className="text-gray-500 text-sm">{profile?.email || ""}</p>
          </div>
          <i className="hidden sm:block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </i>
        </div>
      </div>
    </div>
  );
};

export default HeaderAdmin;
