import React, { useEffect, useState } from "react";
import { LuTrash } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import { usersData } from "../data/usersData";

const TableUser: React.FC = () => {
  const [users, setUsers] = useState(usersData); //Declare users state with initial data from usersData
  const [loading, setLoading] = useState(true); //Loading state to show loading spinner
  const [currentPage, setCurrentPage] = useState(1); //Current page state for pagination
  const [usersPerPage, setUsersPerPage] = useState(10); //Users per page state for pagination
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); //Sort order state for sorting users by balance
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "inactive"
  >("all"); //Filter status state for filtering users by active/inactive status
  const [error, setError] = useState<string | null>(null); //Error state to handle errors during data loading
  const [darkMode, setDarkMode] = useState<boolean>(false); // Dark mode state to toggle between light and dark themes

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]); //Effect to toggle dark mode

  useEffect(() => {
    setTimeout(() => {
      try {
        if (Math.random() < 0.3) {
          throw new Error("Unable to load data");
        }
        setUsers(usersData);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }, 1500);
  }, []); //Effect to simulate data loading with a timeout

  const handleDeleteUser = (userId: number) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  }; //Function to delete a user from the list

  const handleToggleStatus = (userId: number) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, active: !user.active } : user
      )
    );
  }; //Function to toggle the active/inactive status of a user

  const filteredUsers = users.filter((user) => {
    if (filterStatus === "all") return true;
    return filterStatus === "active" ? user.active : !user.active;
  }); //Filter users based on the selected status

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    return sortOrder === "asc" ? a.balance - b.balance : b.balance - a.balance;
  }); //Sort users based on the selected order (ascending or descending) by balance

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage); //Calculate total pages based on the number of filtered users and users per page
  const indexOfLastUser = currentPage * usersPerPage; //Calculate the index of the last user on the current page
  const indexOfFirstUser = indexOfLastUser - usersPerPage; //Calculate the index of the first user on the current page
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser); //Get the users for the current page by slicing the sorted users array

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }; //Function to handle previous page button click

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  }; //Function to handle next page button click
  const getPaginationPages = () => {
    const pages = [];
    const delta = 2;
    const startPage = Math.max(2, currentPage - delta);
    const endPage = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);
    if (startPage > 2) pages.push("...");
    for (let i = startPage; i <= endPage; i++) pages.push(i);
    if (endPage < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  }; //Function to get pagination pages for rendering the pagination buttons

  return (
    <div className="overflow-x-auto p-4 bg-white dark:bg-gray-900 dark:text-white transition-all">
      <div className="flex justify-end items-center mb-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 border rounded-md transition-all bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
      <h1 className="text-center mb-5 font-bold text-2xl">Table User</h1>
      {/* Button darkmode */}

      {/* usersPerPage */}
      <div className="flex justify-end items-center mb-4">
        <select
          value={usersPerPage}
          onChange={(e) => {
            setUsersPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="px-2 py-1 border border-gray-300 rounded-md dark:bg-gray-700"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>
      {/* Table user */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-5 h-5  border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-gray-500 text-center py-4 font-semibold">
          {error}
        </div>
      ) : users.length === 0 ? (
        <div className="text-gray-500 text-center py-4">
          Unable to load data.
        </div>
      ) : (
        <>
          {" "}
          <table className="min-w-full border border-gray-300 shadow-md rounded-lg">
            <thead>
              <tr className="text-gray-700 text-sm font-bold text-left dark:text-white">
                <th className="px-6 py-3 gap-2  ">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 cursor-pointer" />
                    <span>Name</span>
                  </div>
                </th>
                <th className="px-6 py-3 flex items-center">
                  Balance
                  <button
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    className="ml-2"
                  >
                    {sortOrder === "asc" ? (
                      <AiOutlineArrowUp className="w-4 h-4" />
                    ) : (
                      <AiOutlineArrowDown className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 hidden lg:table-cell">Email</th>
                <th className="px-6 py-3 hidden md:table-cell">Registration</th>
                <th className="px-6 py-3 flex items-center">
                  STATUS
                  <select
                    value={filterStatus}
                    onChange={(e) =>
                      setFilterStatus(
                        e.target.value as "all" | "active" | "inactive"
                      )
                    }
                    className="ml-2 px-2 py-1 border border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
                  >
                    <option value="all">All</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </th>
                <th className="px-6 py-3">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr
                  key={user.id}
                  className="bg-slate-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-left"
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 cursor-pointer"
                      />
                      <span>{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    ${user.balance.toLocaleString()}
                  </td>
                  <td className="px-6 py-3 cursor-pointer hidden lg:table-cell">
                    <a
                      href="#"
                      className="text-blue-500 underline hover:text-blue-700"
                    >
                      {user.email}
                    </a>
                  </td>
                  <td className="px-6 py-3 hidden md:table-cell">
                    {isNaN(new Date(user.registerAt).getTime())
                      ? "Invalid Date"
                      : new Date(user.registerAt).toISOString().split("T")[0]}
                  </td>
                  <td className="px-6 py-3 flex items-center justify-start">
                    <span
                      className={`w-24 px-3 py-1 rounded-full text-center text-xs border border-black ${
                        user.active
                          ? "bg-white text-gray-800"
                          : "bg-gray-400 text-white"
                      }`}
                    >
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex items-center gap-2">
                      <MdOutlineEdit
                        className="w-5 h-5 cursor-pointer"
                        onClick={() => handleToggleStatus(user.id)}
                      />
                      <LuTrash
                        className="w-5 h-5 cursor-pointer"
                        onClick={() => handleDeleteUser(user.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Pages */}
          <div className="flex justify-between items-center mt-4 ">
            <div>{filteredUsers.length} results</div>
            <div className="flex items-center gap-2 text-gray-600 text-sm dark:text-white">
              <button
                onClick={handlePrevPage}
                className="p-2 rounded-none hover:bg-gray-100"
                disabled={currentPage === 1}
              >
                &lt;
              </button>

              {getPaginationPages().map((page, index) =>
                page === "..." ? (
                  <span key={index} className="px-3 text-sm">
                    ...
                  </span>
                ) : (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(Number(page))}
                    className={`w-10 h-10 flex items-center justify-center rounded-md ${
                      currentPage === Number(page)
                        ? "border font-medium text-black dark:text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={handleNextPage}
                className="p-2 rounded-md hover:bg-gray-100"
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TableUser;
