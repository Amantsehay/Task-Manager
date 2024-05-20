import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Textarea } from '../components/utils/Input';
import Loader from '../components/utils/Loader';
import useFetch from '../hooks/useFetch';
import MainLayout from '../layouts/MainLayout';
import validateManyFields from '../validations';

const Task = () => {
  const authState = useSelector(state => state.authReducer);
  const navigate = useNavigate();
  const [fetchData, { loading }] = useFetch();
  const { taskId } = useParams();

  const mode = taskId === undefined ? "add" : "update";
  const [task, setTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: "",
    priority: "",
    status: "pending" // Default status
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    document.title = mode === "add" ? "Add Task" : "Update Task";
  }, [mode]);

  useEffect(() => {
    if (mode === "update") {
      const config = { url: `/tasks/${taskId}`, method: "get", headers: { Authorization: authState.token } };
      fetchData(config, { showSuccessToast: false }).then((data) => {
        setTask(data.task);
        setFormData({
          title: data.task.title,
          description: data.task.description,
          deadline: data.task.deadline,
          priority: data.task.priority,
          status: data.task.status
        });
      });
    }
  }, [mode, authState, taskId, fetchData]);

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  const handleSubmit = e => {
    e.preventDefault();
    const errors = validateManyFields("task", formData);
    setFormErrors({});

    if (errors.length > 0) {
      setFormErrors(errors.reduce((total, ob) => ({ ...total, [ob.field]: ob.err }), {}));
      return;
    }

    const config = mode === "add"
      ? { url: "/tasks", method: "post", data: formData, headers: { Authorization: authState.token } }
      : { url: `/tasks/${taskId}`, method: "put", data: formData, headers: { Authorization: authState.token } };

    fetchData(config).then(() => {
      navigate("/");
    });
  }

  const handleDelete = () => {
    const config = { url: `/tasks/${taskId}`, method: "delete", headers: { Authorization: authState.token } };
    fetchData(config).then(() => {
      navigate("/");
    });
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
          <form className="p-6">
            {loading ? (
              <Loader />
            ) : (
              <>
                <h2 className={`text-3xl mb-6 text-center font-bold ${mode === "add" ? "text-blue-600" : "text-yellow-600"}`}>
                  {mode === "add" ? "Add New Task" : "Edit Task"}
                </h2>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                  <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className={`w-full py-2 px-3 border ${formErrors.title ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:border-blue-500`} />
                  {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                  <Textarea name="description" id="description" value={formData.description} onChange={handleChange} className={`w-full py-2 px-3 border ${formErrors.description ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:border-blue-500`} />
                  {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="status" className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                  <select name="status" id="status" value={formData.status} onChange={handleChange} className="w-full py-2 px-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500">
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label htmlFor="deadline" className="block text-gray-700 text-sm font-bold mb-2">Deadline</label>
                  <input type="date" name="deadline" id="deadline" value={formData.deadline} onChange={handleChange} className={`w-full py-2 px-3 border ${formErrors.deadline ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:border-blue-500`} />
                  {formErrors.deadline && <p className="text-red-500 text-sm mt-1">{formErrors.deadline}</p>}
                </div>
                <div className="mb-4">
                  <label htmlFor="priority" className="block text-gray-700 text-sm font-bold mb-2">Priority</label>
                  <select name="priority" id="priority" value={formData.priority} onChange={handleChange} className={`w-full py-2 px-3 border ${formErrors.priority ? "border-red-500" : "border-gray-300"} rounded focus:outline-none focus:border-blue-500`}>
                    <option value="">Select Priority</option>
                    <option value="low" className="text-green-500">Low</option>
                    <option value="medium" className="text-yellow-500">Medium</option>
                    <option value="high" className="text-red-500">High</option>
                  </select>
                  {formErrors.priority && <p className="text-red-500 text-sm mt-1">{formErrors.priority}</p>}
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <button className="bg-blue-500 text-white px-4 py-2 font-medium hover:bg-blue-600 rounded focus:outline-none focus:shadow-outline mb-2 sm:mb-0" onClick={handleSubmit}>
                    {mode === "add" ? "Add Task" : "Update Task"}
                  </button>
                  {mode === "update" && (
                   
                   <button className="bg-red-500 text-white px-4 py-2 font-medium hover:bg-red-600 rounded focus:outline-none focus:shadow-outline mb-2 sm:mb-0" onClick={handleDelete}>Delete Task</button>
                  )}
                  <button className="bg-gray-500 text-white px-4 py-2 font-medium hover:bg-gray-600 rounded focus:outline-none focus:shadow-outline" onClick={() => navigate("/")}>Cancel</button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default Task;
