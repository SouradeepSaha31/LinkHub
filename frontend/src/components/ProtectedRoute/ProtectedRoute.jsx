import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function ProtectedRoute(props) {
  const { Component } = props;
  const { user_id } = useParams()
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser === null || storedUser === "") {
          navigate("/login");
      } else {
          setUser(JSON.parse(storedUser));
      }
  }, [navigate]);

  if (user === null) {
      return null; // Or a loading spinner, etc.
  }

  return <Component user={user} user_id = {user_id} />;

}


export default ProtectedRoute