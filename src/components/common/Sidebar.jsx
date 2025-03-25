import XSvg from "../svgs/X";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Sidebar = () => {
  const queryClient = useQueryClient();
  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/auth/logout`,
          {
            method: "POST",
            credentials: "include",
          }
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });
  const { data: authUser } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/auth/me`,
          {
            credentials: "include",
          }
        );
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
      <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
        <Link to="/" className="flex justify-center md:justify-start">
          <XSvg className="px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900" />
        </Link>

        <ul className="flex flex-col gap-3 mt-4">
          <Link
            to="/"
            className="flex justify-center md:justify-start hover:bg-stone-900 transition-all rounded-full duration-300 cursor-pointer py-2 pl-2 pr-4"
          >
            <MdHomeFilled className="w-7 h-7" />
            <span className="text-lg hidden md:block pl-2">Home</span>
          </Link>

          <Link
            to="/notifications"
            className="flex justify-center md:justify-start hover:bg-stone-900 transition-all rounded-full duration-300 cursor-pointer py-2 pl-2 pr-4"
          >
            <IoNotifications className="w-6 h-6" />
            <span className="text-lg hidden md:block pl-3">Notifications</span>
          </Link>

          <Link
            to={`/profile/${authUser?.username}`}
            className="flex justify-center md:justify-start hover:bg-stone-900 transition-all rounded-full duration-300 cursor-pointer py-2 pl-2 pr-4"
          >
            <FaUser className="w-6 h-6" />
            <span className="text-lg hidden md:block pl-3">Profile</span>
          </Link>
        </ul>

        {authUser && (
          <Link
            to={`/profile/${authUser.username}`}
            className="mt-auto mb-10 flex gap-2 items-start transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full"
          >
            <div className="avatar hidden md:inline-flex">
              <div className="w-8 rounded-full">
                <img src={authUser?.profileImg || "/avatar-placeholder.png"} />
              </div>
            </div>
            <div className="flex justify-between flex-1">
              <div className="hidden md:block">
                <p className="text-white font-bold text-sm w-20 truncate">
                  {authUser?.fullName}
                </p>
                <p className="text-slate-500 text-sm">@{authUser?.username}</p>
              </div>
              <BiLogOut
                className="w-5 h-5 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
              />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};
export default Sidebar;
