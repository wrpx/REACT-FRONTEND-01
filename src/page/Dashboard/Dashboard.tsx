import React, { useEffect, useReducer, useCallback } from 'react';
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

interface State {
  userList: User[];
  currentPageIndex: number;
  totalUsers: number;
  isEditModalOpen: boolean;
  editingUser: User | null;
  newPersonalInfo: string;
}

type Action =
  | { type: 'SET_USERS'; users: User[]; total: number }
  | { type: 'SET_PAGE'; page: number }
  | { type: 'OPEN_EDIT_MODAL'; user: User }
  | { type: 'CLOSE_EDIT_MODAL' }
  | { type: 'SET_PERSONAL_INFO'; info: string };

const initialState: State = {
  userList: [],
  currentPageIndex: 0,
  totalUsers: 0,
  isEditModalOpen: false,
  editingUser: null,
  newPersonalInfo: '',
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_USERS':
      return { ...state, userList: action.users, totalUsers: action.total };
    case 'SET_PAGE':
      return { ...state, currentPageIndex: action.page };
    case 'OPEN_EDIT_MODAL':
      return { ...state, isEditModalOpen: true, editingUser: action.user, newPersonalInfo: action.user.personalInfo };
    case 'CLOSE_EDIT_MODAL':
      return { ...state, isEditModalOpen: false, editingUser: null, newPersonalInfo: '' };
    case 'SET_PERSONAL_INFO':
      return { ...state, newPersonalInfo: action.info };
    default:
      return state;
  }
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(reducer, initialState);
  const itemsPerPage = 5;

  const fetchUsers = useCallback(async () => {
    try {
      const response = await getUsers(state.currentPageIndex, itemsPerPage);
      dispatch({ type: 'SET_USERS', users: response.users, total: response.total });
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, [state.currentPageIndex, itemsPerPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePageClick = ({ selected }: { selected: number }) => {
    dispatch({ type: 'SET_PAGE', page: selected });
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
      dispatch({ type: 'SET_USERS', users: [...state.userList, response], total: state.totalUsers + 1 });
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  const handleEditUser = (id: number) => {
    const userToEdit = state.userList.find(user => user.id === id);
    if (userToEdit) {
      dispatch({ type: 'OPEN_EDIT_MODAL', user: userToEdit });
    }
  };

  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUser(id);
      const updatedUsers = state.userList.filter(user => user.id !== id);
      dispatch({ type: 'SET_USERS', users: updatedUsers, total: state.totalUsers - 1 });
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const offset = state.currentPageIndex * itemsPerPage; 
  const currentPageData = state.userList.slice(offset, offset + itemsPerPage); 
  const pageCount = Math.ceil(state.userList.length / itemsPerPage); 

  const handleSaveEdit = async () => {
    if (state.editingUser) {
      try {
        const updatedUser = await updateUser(state.editingUser.id, { personalInfo: state.newPersonalInfo });
        const updatedUsers = state.userList.map(user =>
          user.id === state.editingUser!.id ? updatedUser : user
        );
        dispatch({ type: 'SET_USERS', users: updatedUsers, total: state.totalUsers });
        dispatch({ type: 'CLOSE_EDIT_MODAL' });
      } catch (error) {
        console.error("Failed to update user:", error);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>TOTAL USERS: {state.totalUsers}</h1>
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
      {state.isEditModalOpen && state.editingUser && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2 className="modal-title">Edit Personal Information</h2>
            <div className="modal-body">
              <p className="user-name">Name: {state.editingUser.name}</p>
              <textarea
                className="edit-textarea"
                value={state.newPersonalInfo}
                onChange={(e) => dispatch({ type: 'SET_PERSONAL_INFO', info: e.target.value })}
                placeholder="Personal information"
              />
            </div>
            <div className="modal-actions">
              <button className="btn-save" onClick={handleSaveEdit}>Save</button>
              <button className="btn-cancel" onClick={() => dispatch({ type: 'CLOSE_EDIT_MODAL' })}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;