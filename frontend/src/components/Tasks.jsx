import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loader from './utils/Loader';
import Tooltip from './utils/Tooltip';

const Tasks = () => {
  const authState = useSelector(state => state.authReducer);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [fetchData, { loading }] = useFetch();
  const [sortBy, setSortBy] = useState(null);
  const [filterByStatus, setFilterByStatus] = useState(null);

  const fetchTasks = useCallback(() => {
    const config = { url: "/tasks", method: "get", headers: { Authorization: authState.token } };
    fetchData(config, { showSuccessToast: false }).then(data => {
      setTasks(data.tasks);
      setFilteredTasks(data.tasks);
    });
  }, [authState.token, fetchData]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTasks();
  }, [authState.isLoggedIn, fetchTasks]);

  const handleDelete = (id) => {
    const config = { url: `/tasks/${id}`, method: "delete", headers: { Authorization: authState.token } };
    fetchData(config).then(() => fetchTasks());
  }

  const filterTasks = (status) => {
    if (status === 'all') {
      setFilteredTasks(tasks);
      setFilterByStatus(null);
    } else {
      const filtered = tasks.filter(task => task.status === status);
      setFilteredTasks(filtered);
      setFilterByStatus(status);
    }
  }

  const sortByPriority = () => {
    const sorted = [...filteredTasks].sort((a, b) => {
      if (a.priority === b.priority) return 0;
      return a.priority === 'high' ? -1 : 1;
    });
    setFilteredTasks(sorted);
    setSortBy('priority');
  }

  const sortByDeadline = () => {
    const sorted = [...filteredTasks].sort((a, b) => {
      return new Date(a.deadline) - new Date(b.deadline);
    });
    setFilteredTasks(sorted);
    setSortBy('deadline');
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-200">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">Your Tasks</h2>
        <div className="flex justify-between mb-6">
          <div>
            <button onClick={() => filterTasks('all')} className={`mr-2 py-2 px-4 rounded-md hover:bg-blue-100 focus:outline-none transition duration-300 ${filterByStatus === null ? 'bg-blue-500 text-white' : 'text-blue-500'}`}>All</button>
            <button onClick={() => filterTasks('pending')} className={`mr-2 py-2 px-4 rounded-md hover:bg-yellow-100 focus:outline-none transition duration-300 ${filterByStatus === 'pending' ? 'bg-yellow-500 text-white' : 'text-yellow-500'}`}>Pending</button>
            <button onClick={() => filterTasks('completed')} className={`py-2 px-4 rounded-md hover:bg-green-100 focus:outline-none transition duration-300 ${filterByStatus === 'completed' ? 'bg-green-500 text-white' : 'text-green-500'}`}>Completed</button>
          </div>
          <div>
            <button onClick={sortByPriority} className={`mr-2 py-2 px-4 rounded-md hover:bg-gray-100 focus:outline-none transition duration-300 ${sortBy === 'priority' ? 'bg-gray-500 text-white' : 'text-gray-500'}`}>Sort by Priority</button>
            <button onClick={sortByDeadline} className={`py-2 px-4 rounded-md hover:bg-gray-100 focus:outline-none transition duration-300 ${sortBy === 'deadline' ? 'bg-gray-500 text-white' : 'text-gray-500'}`}>Sort by Deadline</button>
          </div>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <>
            {filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center space-y-4">
                <p className="text-gray-600">No tasks found.</p>
                <Link to="/tasks/add" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 font-medium transition duration-300">+ Add New Task</Link>
              </div>
            ) : (
              filteredTasks.map(task => (
                <div key={task._id} className="bg-white rounded-md shadow-md p-6 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    {/* Displaying the title above the description */}
                    <div>
                      <span className="text-xl font-semibold">{task.title}</span>
                      <p className="text-gray-600 mb-2">{task.description}</p>
                    </div>
                    <div className="flex space-x-4">
                      <Tooltip text="Edit this task" position="top">
                        <Link to={`/tasks/${task._id}`} className="text-green-600 hover:text-green-700 transition duration-300">
                          <i className="fas fa-pencil-alt"></i>
                        </Link>
                      </Tooltip>
                      <Tooltip text="Delete this task" position="top">
                        <button className="text-red-600 hover:text-red-700 focus:outline-none transition duration-300" onClick={() => handleDelete(task._id)}>
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className={`py-1 px-2 rounded-md ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'} text-white font-medium`}>
                      Priority: {task.priority}
                    </div>
                    <div className="py-1 px-2 rounded-md bg-blue-500 text-white font-medium">
                      Deadline: {new Date(task.deadline).toLocaleDateString()}
                    </div>
                    <div className={`py-1 px-2 rounded-md ${task.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'} text-white font-medium`}>
                      Status: {task.status}
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Tasks;
