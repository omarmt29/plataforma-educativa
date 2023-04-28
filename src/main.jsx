import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Dashboard from './Dashboard.jsx'
import './index.css'
import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";
import Student from './student.jsx'



const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "admin",
        element: <Dashboard />
    },
    {
        path: "student",
        element: <Student />
    },
   
]);


ReactDOM.createRoot(document.getElementById('root')).render(

    <RouterProvider router={router} />
)
