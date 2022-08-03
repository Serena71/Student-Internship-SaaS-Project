import React, { useEffect, useState } from 'react';
import './ResumePage.css';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import Education from '../components/resume_component/education';
import WorkExperience from '../components/resume_component/work-experience';
import ProjectExperience from '../components/resume_component/project-experience';
import Skill from '../components/resume_component/skill';
import Awards from '../components/resume_component/awards';
import ProjectDisplay from '../components/resume_component/project-display';
import MyDialog from '../components/resume_component/my-dialog';
import NavBar from '../components/component_NavBar/NavBar';
import { apiGet, apiPost } from '../components/API';
import JobPanel from '../components/component_JobPanel/JobPanel';
import { useParams, useLocation } from 'react-router-dom';

// import { getResume, submitResume } from '../../api/resume';

function ResumePage({ socket }) {
  const [resumeData, setResumeData] = useState({
    userInfo: [],
    education: [],
    workExperience: [],
    projectExperience: [],
    skills: [],
    awards: [],
    projectDisplay: [],
  });

  const [dialogConfig, setDialogConfig] = useState({
    userInfo: [
      {
        label: 'Name',
        required: true,
        type: 'text',
      },
      {
        label: 'University',
        required: true,
        type: 'text',
      },
      {
        label: 'Email',
        required: false,
        type: 'text',
      },
      {
        label: 'About',
        required: false,
        type: 'text',
      },
    ],
    education: [
      {
        label: 'University',
        required: true,
        type: 'text',
      },
      {
        label: 'Start',
        required: true,
        type: 'date',
      },
      {
        label: 'End',
        required: true,
        type: 'date',
      },
      {
        label: 'Faculty',
        required: true,
        type: 'text',
      },
      {
        label: 'Major',
        required: true,
        type: 'text',
      },
      {
        label: 'Grades',
        required: true,
        type: 'text',
      },
    ],
    workExperience: [
      {
        label: 'Company',
        required: true,
        type: 'text',
      },
      {
        label: 'Position',
        required: true,
        type: 'text',
      },
      {
        label: 'Start',
        required: true,
        type: 'date',
      },
      {
        label: 'End',
        required: true,
        type: 'date',
      },
      {
        label: 'Description',
        required: true,
        type: 'text',
      },
    ],
    projectExperience: [
      {
        label: 'Title',
        required: true,
        type: 'text',
      },
      {
        label: 'Start',
        required: true,
        type: 'date',
      },
      {
        label: 'End',
        required: true,
        type: 'date',
      },
      {
        label: 'Description',
        required: true,
        type: 'text',
      },
    ],
    skills: [
      {
        label: 'Skill',
        required: true,
        type: 'text',
      },
    ],
    awards: [
      {
        label: 'Title',
        required: true,
        type: 'text',
      },
      {
        label: 'Description',
        required: true,
        type: 'text',
      },
    ],
    projectDisplay: [
      {
        label: 'Title',
        required: true,
        type: 'text',
      },
      {
        label: 'Link',
        required: true,
        type: 'text',
      },
    ],
  });
  const [open, setOpen] = useState(false);

  const [userInfo, setUserInfo] = useState({});
  const [openUserInfo, setOpenUserInfo] = useState(false);
  const [type, setType] = useState('false');
  const id = sessionStorage.getItem('id');
  const { state } = useLocation();
  // const resumeId = state?.followId
  const params = useParams();
  const resumeId = params.userId;

  useEffect(() => {
    apiGet('user/getResume', { resumeId }).then((res) => {
      console.log(res.data);
      setResumeData(res.data.data);
    });
  }, []);

  const handleClose = () => {
    setOpen(false);
    setOpenUserInfo(false);
  };

  const edit = (type) => {
    setOpen(true);
    setType(type);
  };

  const handleUserInput = (e, type) => {
    let temp = { ...userInfo };
    temp[type] = e.target.value;
    setUserInfo(temp);
  };

  const editUserInfo = (type) => {
    setOpenUserInfo(true);
  };

  const saveUserInfo = () => {
    console.log(userInfo);
    const temp = { ...resumeData };
    temp.userInfo = userInfo;
    setResumeData({ ...temp });
    setOpenUserInfo(false);
  };

  const deleteItem = (index) => {
    const tempData = { ...resumeData };
    tempData[type].splice(index - 1, 1);
    console.log(tempData);
    setResumeData({ ...tempData });
    console.log(tempData);
  };

  const save = (data) => {
    const temp = { ...resumeData };
    temp[type] = data;
    setResumeData({ ...temp });
    setOpen(false);
  };

  const submit = () => {
    apiPost('user/submitResume', { resumeid: id, resume: resumeData }).then((res) => {
      console.log('提交成功');
    });
  };

  const cancel = () => {
    setOpen(false);
  };

  const uploadAvatar = () => {
    const inputEl = document.createElement('input');
    inputEl.type = 'file';
    inputEl.click();
    inputEl.onchange = (e) => {
      const file = e.target.files[0];
      if (!!file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
          let data = e.target.result;
          apiPost('/api/upload_image', {
            user_id: id,
            image_base64: data,
          }).then((res) => {
            let temp = { ...resumeData };
            temp.userInfo.thumbnail = res.data;
            setResumeData({ ...temp });
          });
        };
      }
    };
  };

  const handleFollow = () => {
    if (state.isFollow) {
      apiGet('user/following', { userId: id }).then((res) => {
        alert('follow success');
      });
    } else {
      apiGet('user/following', { userId: id }).then((res) => {
        alert('unFollow success');
      });
    }
  };

  const student_resume = (
    <div>
      <div className="education resume_item">
        <div className="header">
          <span>Education</span>
          <Button variant="contained" size="small" onClick={() => edit('education')}>
            edit
          </Button>
        </div>
        <div className="content">
          <Education education={resumeData.education} />
        </div>
      </div>
      <div className="work_experience resume_item">
        <div className="header">
          <span>Work Experience</span>
          <Button variant="contained" size="small" onClick={() => edit('workExperience')}>
            edit
          </Button>
        </div>
        <div className="content">
          <WorkExperience workExperience={resumeData.workExperience} />
        </div>
      </div>
      <div className="project_experience resume_item">
        <div className="header">
          <span>Project Experience</span>
          <Button variant="contained" size="small" onClick={() => edit('projectExperience')}>
            edit
          </Button>
        </div>
        <div className="content">
          <ProjectExperience projectExperience={resumeData.projectExperience} />
        </div>
      </div>
      <div className="skill resume_item">
        <div className="header">
          <span>Skills</span>
          <Button variant="contained" size="small" onClick={() => edit('skills')}>
            edit
          </Button>
        </div>
        <div className="content">
          <Skill skill={resumeData.skills} />
        </div>
      </div>
      <div className="Awards resume_item">
        <div className="header">
          <span>Awards</span>
          <Button variant="contained" size="small" onClick={() => edit('awards')}>
            edit
          </Button>
        </div>
        <div className="content">
          <Awards awards={resumeData.awards} />
        </div>
      </div>
      <div className="project_display resume_item">
        <div className="header">
          <span>Project Display</span>
          <Button variant="contained" size="small" onClick={() => edit('projectDisplay')}>
            edit
          </Button>
        </div>
        <div className="content">
          <ProjectDisplay projectDisplay={resumeData.projectDisplay} />
        </div>
      </div>
    </div>
  );

  const hr_detail = (
    <div>
      {/* <div className='header'>
        <span>Introduction</span>
        <Button
          variant='contained'
          size='small'
          onClick={() => edit('projectDisplay')}
        >
          edit
        </Button>
      </div>
      <div className='content'>
        <ProjectDisplay projectDisplay={resumeData.projectDisplay} />
      </div> */}
      <JobPanel />
    </div>
  );

  return (
    <>
      <NavBar type={sessionStorage.getItem('type')} />
      <div className="resume">
        <div className="user_info resume_item">
          <div className="header">
            <div>
              {state?.followId && (
                <Button variant="contained" size="small" onClick={() => handleFollow()}>
                  {state?.isFollow ? 'UnFollow' : 'follow'}
                </Button>
              )}
            </div>
            <Button variant="contained" size="small" onClick={() => editUserInfo()}>
              edit
            </Button>
          </div>
          <div className="content">
            <img
              src={
                resumeData.userInfo?.thumbnail || 'https://pic4.zhimg.com/50/v2-6afa72220d29f045c15217aa6b275808_hd.jpg'
              }
              alt=""
              className="avatar"
              onClick={uploadAvatar}
            />
            <div className="info_wrap">
              <div className="info_item">Full Name: {resumeData.userInfo?.name || 'n/a'}</div>

              <div className="info_item">
                {sessionStorage.getItem('type') === '0' ? 'Unversity: ' : 'Company: '}
                {resumeData.userInfo?.unversity || 'n/a'}
              </div>

              <div className="info_item">Contact Email: {resumeData.userInfo?.email || 'n/a'}</div>
            </div>
          </div>
          <div className="introduction">{resumeData.userInfo?.introduction}</div>
        </div>
        {sessionStorage.getItem('type') === '0' ? student_resume : hr_detail}

        <div className="resume_footer">
          <Button className="save" variant="contained" size="small" color="success" onClick={() => submit()}>
            save
          </Button>
        </div>
      </div>
      <Dialog open={open} onClose={handleClose} scroll="paper" fullWidth maxWidth="md">
        <MyDialog
          config={dialogConfig[type]}
          save={save}
          cancel={cancel}
          deleteItem={deleteItem}
          data={resumeData[type]}
          type={type}
        ></MyDialog>
      </Dialog>
      <Dialog open={openUserInfo} onClose={handleClose} scroll="paper" fullWidth maxWidth="md">
        <div className="user_form">
          <div className="form_item">
            <div className="label">Name:</div>
            <TextField
              className="input"
              size="small"
              onChange={(e) => handleUserInput(e, 'name')}
              fullWidth
              defaultValue={resumeData.userInfo.name}
            />
          </div>
          <div className="form_item">
            <div className="label"> {sessionStorage.getItem('type') === '0' ? 'Unversity: ' : 'Company: '}</div>
            <TextField
              className="input"
              size="small"
              onChange={(e) => handleUserInput(e, 'unversity')}
              fullWidth
              defaultValue={resumeData.userInfo.name}
            />
          </div>
          <div className="form_item">
            <div className="label">Contact Email:</div>
            <TextField
              className="input"
              size="small"
              onChange={(e) => handleUserInput(e, 'email')}
              fullWidth
              defaultValue={resumeData.userInfo.name}
            />
          </div>
          <div className="footer">
            <Button
              className="cancel"
              variant="contained"
              size="small"
              color="error"
              onClick={() => setOpenUserInfo(false)}
            >
              cancel
            </Button>
            <Button className="save" variant="contained" size="small" onClick={() => saveUserInfo()}>
              save
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default ResumePage;
