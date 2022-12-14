import React from 'react';
import NavBar from '../components/component_NavBar/NavBar';
import Button from '@mui/material/Button';
import JobPanel from '../components/component_JobPanel/JobPanel';
import { useNavigate } from 'react-router-dom';
import { dummyJobs } from '../components/assets';

import './Dashboard.css';
import { apiGet } from '../components/API';

export default function DashboardPage({ socket }) {
  const navigate = useNavigate();
  const [logedIn, setLogedIn] = React.useState(false);
  const [jobs, setJobs] = React.useState([]);
  const [refresh, setRefresh] = React.useState(false);

  function AddJob() {
    // get follower list
    // apiGet('user/follower', { userId: sessionStorage.getItem('id') }).then((res) => {
    //   // const followers;
    //   console.log(res.errormessage);
    //   res.errormessage.map((user) => {
    //     socket?.emit('newJob', {
    //       senderName: sessionStorage.getItem('id'),
    //       receiverName: user.id,
    //     });
    //   });
    // });
    navigate('/addjob');
  }
  React.useEffect(() => {
    if (!sessionStorage.getItem('token')) {
      alert('Your are not logged in');
      navigate('/login');
      //setLogedIn(true);
    } else {
      setLogedIn(true);
    }
    socket?.emit('newUser', sessionStorage.getItem('id'));
  }, [logedIn]);

  React.useEffect(() => {
    apiGet('internship/get_all_intern', { id: sessionStorage.getItem('id') }).then((res) => {
      const temp = Object.values(res.data);
      temp.sort((a, b) => new Date(a.update_time).getTime() - new Date(b.update_time).getTime());
      setJobs(temp.reverse());
    });
  }, [refresh]);

  return (
    logedIn && (
      <div>
        <NavBar type={sessionStorage.getItem('type')} socket={socket} setRefresh={setRefresh} />
        <div className="dashboard-main">
          <h3>My Job Posts</h3>
          <Button className="add-job-button" variant="contained" color="success" onClick={AddJob}>
            Add a Job Post
          </Button>
          <div className="jobSection">
            <JobPanel jobs={jobs} type="myJob" refresh={setRefresh} />
          </div>
        </div>
      </div>
    )
  );
}
