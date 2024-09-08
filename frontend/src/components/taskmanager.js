import React, { useEffect, useState } from 'react';
import { fetchTasks, updateTask, createTask, deleteTask } from '../apis/api'; 
import { useNavigate } from 'react-router-dom';
import './taskmanager.css'; 

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortBy, setSortBy] = useState('recent');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();



  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    fetchTasks(token).then(({ data }) => setTasks(data));
  }, [token, navigate]);

  const handleDeleteTask = (id) => {
    deleteTask(id, token).then(() => {
      setTasks(tasks.filter((task) => task._id !== id));
    });
  };

 
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };


  const handleSort = (e) => {
    setSortBy(e.target.value);
  };


  const handleAddTask = async (e) => {
    e.preventDefault();
    if (newTaskTitle.trim() === '') return;

    createTask({ title: newTaskTitle, description: newTaskDescription, status: 'todo' }, token).then(({ data }) => {
      setTasks([...tasks, data]);
      setNewTaskTitle('');
      setNewTaskDescription('');
      setShowAddModal(false);
    });
  };

  // Edit task
  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  // Save edited task
  const handleSaveEdit = (editedTask) => {
    updateTask(editedTask._id, editedTask, token).then(({ data }) => {
      setTasks(tasks.map((task) => (task._id === data._id ? data : task)));
      setEditingTask(null);
    });
  };

  // Logout functionality
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Sorted tasks
  const sortedTasks = tasks.sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    else if (sortBy==='oldest'){
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
    return 0;
  });

  
  return (
    <div className="container">
      <header className="navbar">
        <div className="logo">📅</div>
        <div className="nav-links">
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="task-manager-container">
        <div className="header-actions">
          <button onClick={() => setShowAddModal(true)} className="add-btn">Add Task</button>
        </div>

        {/* Search and Sort */}
        <div className="search-sort-container">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearch}
            className="input-field"
          />
          <select value={sortBy} onChange={handleSort} className="sort-select">
            <option value="recent">Sort by Recent</option>
            <option value="oldest">oldest</option>
          </select>
        </div>

        <div className="task-columns">
          {['todo', 'in-progress', 'done'].map((column) => (
            <div key={column} className="task-column">
              <h2 className="column-title">{column.replace('-', ' ')}</h2>
              {sortedTasks
                .filter(
                  (task) =>
                    task.status === column &&
                    task.title.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((task) => (
                  <div key={task._id} className="task-item">
                    <p>{task.title}</p>
                    <p className="task-created-at">{new Date(task.createdAt).toLocaleString()}</p>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEditTask(task)}
                      className="edit-btn"
                    >
                    Edit
                    </button>
                    <button
                      onClick={() => setViewingTask(task)}
                      className="view-btn"
                    >
                      View Details
                    </button>
                  </div>
                ))}
            </div>
          ))}
        </div>

        {/* Add Task Modal */}
        {showAddModal && (
          <AddTaskModal
            task={{ title: newTaskTitle, description: newTaskDescription }}
            onSave={handleAddTask}
            onClose={() => setShowAddModal(false)}
            setNewTaskTitle={setNewTaskTitle}
            setNewTaskDescription={setNewTaskDescription}
          />
        )}

        {/* Edit Task Modal */}
        {editingTask && (
          <EditTaskModal
            task={editingTask}
            onSave={handleSaveEdit}
            onClose={() => setEditingTask(null)}
          />
        )}

        {/* View Task Modal */}
        {viewingTask && (
          <ViewTaskModal
            task={viewingTask}
            onClose={() => setViewingTask(null)}
          />
        )}
      </div>
    </div>
  );
};

// Add Task Modal Component
const AddTaskModal = ({ task, onSave, onClose, setNewTaskTitle, setNewTaskDescription }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'title') setNewTaskTitle(value);
    if (name === 'description') setNewTaskDescription(value);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Add New Task</h2>
        <form onSubmit={onSave}>
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            className="modal-input"
            placeholder="Title"
          />
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            className="modal-textarea"
            placeholder="Description"
          />
          <div className="modal-actions">
            <button type="submit" className="modal-button save-button">Add Task</button>
            <button type="button" onClick={onClose} className="modal-button cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Task Modal Component
const EditTaskModal = ({ task, onSave, onClose }) => {
  const [editedTask, setEditedTask] = useState(task);

  const handleChange = (e) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedTask);
  };


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Edit Task</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={editedTask.title}
            onChange={handleChange}
            className="modal-input"
            placeholder="Title"
          />
          <textarea
            name="description"
            value={editedTask.description || ''}
            onChange={handleChange}
            className="modal-textarea"
            placeholder="Description"
          />
          <div className="modal-actions">
            <button type="submit" className="modal-button save-button">Save</button>
            <button type="button" onClick={onClose} className="modal-button cancel-button">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// View Task Modal Component
const ViewTaskModal = ({ task, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2 className="modal-title">View Task</h2>
      <p><strong>Title:</strong> {task.title}</p>
      <p><strong>Created at:</strong> {task.createdAt}</p>
      <p className="modal-description">{task.description}</p>
      <div className="modal-actions">
        <button onClick={onClose} className="modal-button close-button">Close</button>
      </div>
    </div>
  </div>
);

export default TaskManager;











// //finallyupdated
// import React, { useEffect, useState } from 'react';
// import { fetchTasks, updateTask, createTask, deleteTask } from '../apis/api'; // Assuming you have these API functions
// import { useNavigate } from 'react-router-dom';
// import './taskmanager.css'; // CSS file for styling

// const TaskManager = () => {
//   const [tasks, setTasks] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [newTask, setNewTask] = useState('');
//   const [editingTask, setEditingTask] = useState(null);
//   const [viewingTask, setViewingTask] = useState(null);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [sortBy, setSortBy] = useState('recent');
//   const token = localStorage.getItem('token');
//   const navigate = useNavigate();

//   // Fetch tasks on component mount
//   useEffect(() => {
//     if (!token) {
//       navigate('/');
//       return;
//     }
//     fetchTasks(token).then(({ data }) => setTasks(data));
//   }, [token, navigate]);

//   // Delete task
//   const handleDeleteTask = (id) => {
//     deleteTask(id, token).then(() => {
//       setTasks(tasks.filter((task) => task._id !== id));
//     });
//   };

//   // Search task by title
//   const handleSearch = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   // Sort tasks
//   const handleSort = (e) => {
//     setSortBy(e.target.value);
//   };

//   // Add new task
//   const handleAddTask = async (e) => {
//     e.preventDefault(); // Make sure this is only triggered on form submit
//     if (newTask.trim() === '') return;

//     createTask({ title: newTask, status: 'todo' }, token).then(({ data }) => {
//       setTasks([...tasks, data]);
//       setNewTask('');
//       setShowAddModal(false);
//     });
//   };

//   // Edit task
//   const handleEditTask = (task) => {
//     setEditingTask(task);
//   };

//   // Save edited task
//   const handleSaveEdit = (editedTask) => {
//     updateTask(editedTask._id, editedTask, token).then(({ data }) => {
//       setTasks(tasks.map((task) => (task._id === data._id ? data : task)));
//       setEditingTask(null);
//     });
//   };

//   // Logout functionality
//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   // Sorted tasks
//   const sortedTasks = tasks.sort((a, b) => {
//     if (sortBy === 'recent') {
//       return new Date(b.createdAt) - new Date(a.createdAt);
//     }
//     // Implement other sorting criteria as needed
//     return 0;
//   });

//   return (
//     <div className="container">
//       <header className="navbar">
//         <div className="logo">📅</div>
//         <div className="nav-links">
//           <button onClick={handleLogout} className="logout-btn">Logout</button>
//         </div>
//       </header>

//       <div className="task-manager-container">
//         <div className="header-actions">
//           <button onClick={() => setShowAddModal(true)} className="add-btn">
//             Add Task
//           </button>
//         </div>

//         {/* Search and Sort */}
//         <div className="search-sort-container">
//           <input
//             type="text"
//             placeholder="Search tasks..."
//             value={searchTerm}
//             onChange={handleSearch}
//             className="input-field"
//           />
//           <select value={sortBy} onChange={handleSort} className="sort-select">
//             <option value="recent">Sort by Recent</option>
//             {/* Add other sorting options here */}
//           </select>
//         </div>

//         {/* Task Columns */}
//         <div className="task-columns">
//           {['todo', 'in-progress', 'done'].map((column) => (
//             <div key={column} className="task-column">
//               <h2 className="column-title">{column.replace('-', ' ')}</h2>
//               {sortedTasks
//                 .filter(
//                   (task) =>
//                     task.status === column &&
//                     task.title.toLowerCase().includes(searchTerm.toLowerCase())
//                 )
//                 .map((task) => (
//                   <div key={task._id} className="task-item">
//                     <p>{task.title}</p>
//                     <button
//                       onClick={() => handleEditTask(task)}
//                       className="edit-btn"
//                     >
//                       ✏️
//                     </button>
//                     <button
//                       onClick={() => handleDeleteTask(task._id)}
//                       className="delete-btn"
//                     >
//                       🗑️
//                     </button>
//                     <button
//                       onClick={() => setViewingTask(task)}
//                       className="view-btn"
//                     >
//                       👁️
//                     </button>
//                   </div>
//                 ))}
//             </div>
//           ))}
//         </div>

//         {/* Add Task Modal */}
//         {showAddModal && (
//           <EditTaskModal
//             task={{ title: newTask, description: '' }}
//             onSave={handleAddTask}
//             onClose={() => setShowAddModal(false)}
//           />
//         )}

//         {/* Edit Task Modal */}
//         {editingTask && (
//           <EditTaskModal
//             task={editingTask}
//             onSave={handleSaveEdit}
//             onClose={() => setEditingTask(null)}
//           />
//         )}

//         {/* View Task Modal */}
//         {viewingTask && (
//           <ViewTaskModal
//             task={viewingTask}
//             onClose={() => setViewingTask(null)}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// const EditTaskModal = ({ task, onSave, onClose }) => {
//   const [editedTask, setEditedTask] = useState(task);

//   const handleChange = (e) => {
//     setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSave(editedTask);
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <h2 className="modal-title">Edit Task</h2>
//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             name="title"
//             value={editedTask.title}
//             onChange={handleChange}
//             className="modal-input"
//             placeholder="Title"
//           />
//           <textarea
//             name="description"
//             value={editedTask.description || ''}
//             onChange={handleChange}
//             className="modal-textarea"
//             placeholder="Description"
//           />
//           <div className="modal-actions">
//             <button type="submit" className="modal-button save-button">Save</button>
//             <button type="button" onClick={onClose} className="modal-button cancel-button">Cancel</button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// const ViewTaskModal = ({ task, onClose }) => {
//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <h2 className="modal-title">Task Details</h2>
//         <p><strong>Title:</strong> {task.title}</p>
//         <p><strong>Description:</strong> {task.description}</p>
//         <p><strong>Created at:</strong> {task.createdAt}</p>
//         <div className="modal-actions">
//           <button onClick={onClose} className="modal-button close-button">Close</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TaskManager;




