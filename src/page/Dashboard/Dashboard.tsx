import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { addUser, deleteUser, getUsers, updateUser } from '../../api/userService';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  personalInfo: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [userList, setUserList] = useState<User[]>([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, [currentPageIndex]);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUserList(response.users);
      setTotalUsers(response.total);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handlePageClick = ({ selected }: { selected: number }) => {
    if (selected >= 0 && selected < pageCount) {
      setCurrentPageIndex(selected);
    }
  };

  const handleAddUser = async () => {
    try {
      const newUser = {
        name: "New User",
        email: "newuser@example.com",
        role: "User",
        personalInfo: "New user info"
      };
      const response = await addUser(newUser);
      setUserList([...userList, response]);
      setTotalUsers(totalUsers + 1);
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  const handleEditUser = (id: number) => {
    const userToEdit = userList.find(user => user.id === id);
    if (userToEdit) {
      setEditingUser(userToEdit);
      setNewPersonalInfo(userToEdit.personalInfo);
      setIsEditModalOpen(true);
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id);
      const updatedUsers = userList.filter(user => user.id !== id);
      setUserList(updatedUsers);
      setTotalUsers(totalUsers - 1);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const offset = currentPageIndex * itemsPerPage; 
  const currentPageData = userList.slice(offset, offset + itemsPerPage); 
  const pageCount = Math.ceil(userList.length / itemsPerPage); 

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newPersonalInfo, setNewPersonalInfo] = useState('');

  const handleSaveEdit = async () => {
    if (editingUser) {
      try {
        const updatedUser = await updateUser(editingUser.id, { personalInfo: newPersonalInfo });
        const updatedUsers = userList.map(user =>
          user.id === editingUser.id ? updatedUser : user
        );
        setUserList(updatedUsers);
        setIsEditModalOpen(false);
        setEditingUser(null);
      } catch (error) {
        console.error("Failed to update user:", error);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>TOTAL USERS: {totalUsers}</h1>
          <button className="btn-primary" onClick={handleAddUser}>+ ADD NEW USER</button>
        </div>
        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ROLE</th>
                <th>PERSONAL INFO</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.personalInfo}</td>
                  <td>
                    <div className="action-icons">
                      <span className="icon edit-icon" onClick={() => handleEditUser(user.id)}>✏️</span>
                      <span className="icon delete-icon" onClick={() => handleDeleteUser(user.id)}>🗑️</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination-container">
          <ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            breakLabel={'...'}
            pageCount={pageCount}
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
            previousClassName={'page-item'}
            nextClassName={'page-item'}
            pageClassName={'page-item'}
            breakClassName={'page-item'}
            pageLinkClassName={'page-link'}
            previousLinkClassName={'page-link'}
            nextLinkClassName={'page-link'}
            breakLinkClassName={'page-link'}
            disabledClassName={'disabled'}
          />
        </div>
        <button className="btn-back" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
      {isEditModalOpen && editingUser && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Edit Personal Information</h2>
            <div className="modal-body">
              <p className="user-name">Name: {editingUser.name}</p>
              <textarea
                className="edit-textarea"
                value={newPersonalInfo}
                onChange={(e) => setNewPersonalInfo(e.target.value)}
                placeholder="Personal information"
              />
            </div>
            <div className="modal-actions">
              <button className="btn-save" onClick={handleSaveEdit}>Save</button>
              <button className="btn-cancel" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
