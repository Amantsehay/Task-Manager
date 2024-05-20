import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Tasks from '../components/Tasks';
import MainLayout from '../layouts/MainLayout';

const Home = () => {
  const authState = useSelector(state => state.authReducer);
  const { isLoggedIn } = authState;

  useEffect(() => {
    document.title = authState.isLoggedIn ? `${authState.user.name}'s Tasks` : "Task Manager";
  }, [authState]);

  return (
    <MainLayout>
      <div className="container mx-auto">
        {!isLoggedIn ? (
          <div className=' text-white rounded-lg py-8 text-center'>
            <h1 className='text-4xl font-bold mb-4'>Your Task Manager</h1>
            <p className='text-lg mb-8'>Organize your tasks with ease</p>
            <Link to="/signup" className='btn-secondary text-yellow-800 text-lg'>Join Now</Link>
          </div>
        ) : (
          
          <div>
            <h1 className='text-lg font-bold mt-8 mb-4 text-center'>Welcome, {authState.user.name}</h1>
            <Tasks/>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Home;
