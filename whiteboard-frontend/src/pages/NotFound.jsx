import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <h1 className="text-3xl font-bold mb-4">404 - Page Not Found</h1>
      <Link to="/" className="text-blue-500 underline">
        Go back to Home
      </Link>
    </div>
  </div>
);

export default NotFound;
