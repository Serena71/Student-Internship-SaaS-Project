import * as React from 'react';

import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { Paper } from '@mui/material';

import { apiGet, apiPost } from '../API';

import './JobCard.css';
import { useNavigate } from 'react-router-dom';

export default function JobCard(props) {
  const [save, setSave] = React.useState(false);
  const navigate = useNavigate();

  function getCardAction(type) {
    switch (type) {
      case 'home':
        return (
          <CardActions className="job-card-action">
            <Button size="small" onClick={props.handleApply} variant="outlined">
              Apply
            </Button>
            <div onClick={handleSave}>
              {!save && <BookmarkAddOutlinedIcon className="BookmarkIcon" />}
              {save && <BookmarkAddedIcon className="BookmarkIcon" />}
            </div>
          </CardActions>
        );
      case 'saved':
        return (
          <CardActions className="job-card-action">
            <Button size="small" variant="outlined" color="success" endIcon={<SendIcon />} onClick={props.handleApply}>
              Apply
            </Button>

            <Button
              className="BookmarkIcon"
              size="small"
              // sx={{background}}
              variant="outlined"
              endIcon={<BookmarkAddedIcon />}
              onClick={handleUnsave}
            >
              Click to Unsave
            </Button>

            {/* //   <BookmarkAddOutlinedIcon className="BookmarkIcon" /> */}

            {/* {save && <BookmarkAddedIcon className="BookmarkIcon" />} */}
          </CardActions>
        );
      case 'myJob':
        return (
          <CardActions className="myjob-card-action">
            <Button size="small" variant="outlined" onClick={handleEdit}>
              Edit
            </Button>

            <Button
              className="delete-button-text"
              size="small"
              color="error"
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </CardActions>
        );
      default:
        return null;
    }
  }

  const handleSave = (e) => {
    // TODO Save the job
    e.stopPropagation();
    const jobId = e.currentTarget.parentNode.parentNode.id;
    if (!save) {
      // haven't saved it yet
      apiGet('/internship/save', {
        token: sessionStorage.getItem('token'),
        internship: jobId,
      })
        .then((data) => {
          // console.log(data);
        })
        .catch((e) => alert(e));
      setSave(true);
    }
  };

  const handleUnsave = (e) => {
    e.stopPropagation();
    const jobId = e.currentTarget.parentNode.parentNode.id;
    apiGet('/internship/unsave', { internship_id: jobId, user_id: sessionStorage.getItem('id') }).then((d) => {
      alert('You have unsaved the job');
      props.refresh((prev) => !prev);
    });

    setSave(!save);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    const jobID = e.currentTarget.parentNode.parentNode.id;
    // console.log('edit');
    navigate(`/editjob/${jobID}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    const jobID = e.currentTarget.parentNode.parentNode.id;
    // console.log('delete ' + jobID);
    apiGet('internship/del_internship', { id: jobID }).then((res) => {
      props.refresh((prev) => !prev);
    });
  };

  const location = `${props.location.city}, ${props.location.state} ${props.location.country}`;

  return (
    <Paper id={props.jobID} onClick={props.hanldeClickOpen} className="job-card">
      {/* <Card id={props.jobID} className="job-card" variant="outlined" onClick={props.hanldeClickOpen}> */}
      <CardContent>
        <Typography variant="h8" component="div">
          {props.title}
        </Typography>
        <Typography variant="body1" sx={{ mb: 1.5 }}>
          {props.company}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {location}
        </Typography>
        <Typography variant="body" paragraph={true} noWrap={true}>
          {props.briefing}
        </Typography>
      </CardContent>
      {getCardAction(props.type)}
    </Paper>
  );
}
