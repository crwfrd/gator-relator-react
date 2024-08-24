import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../firebase.js";
import './UserInfo.css';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

function UserInfoForm({ userData, onUpdate, companies, tags }) {

  const location = useLocation();

  const [name, setName] = useState(userData[0]);
  const [major, setMajor] = useState(userData[1]);
  const [year, setYear] = useState(userData[2]);
  const [selectedCompanies, setSelectedCompanies] = useState(userData[3]);
  const [selectedTags, setSelectedTags] = useState(userData[4]);
  const [photo, setPhoto] = useState();
  const [photoURL, setPhotoURL] = useState(userData[5]);
  const [previewPhoto, setPreviewPhoto] = useState();


  useEffect(() => {

    const fetchImage = async () => {

      try {
        const storageRef = ref(storage, `images/${location.state.uid}`);
        
        const url = await getDownloadURL(storageRef);

        console.log(url);
        setPhotoURL(url);
      } catch (error) {
        console.error( error);
      }

    };

    fetchImage();
  }, []);

  const handleUpdate = async () => {

    let updateButton = document.getElementById("user-info-update-button");
    updateButton.classList.add('button-loading');
    let spinner = document.createElement('div');
    spinner.classList.add('loading-spinner');
    updateButton.appendChild(spinner);

    const photoRef = ref(storage, `images/${location.state.uid}`);
    const photoTask = uploadBytesResumable(photoRef, photo);

    photoTask.on(
      "state_changed",
      (snapshot) => {
        console.log(snapshot);
      },
      (error) => {
        console.log(error);
        updateButton.classList.remove('button-loading');
        updateButton.removeChild(spinner);
        setPreviewPhoto(null);
        onUpdate([name, major, year, selectedCompanies, selectedTags, photoURL, userData[6]]); 
      },
      () => {
        getDownloadURL(photoTask.snapshot.ref).then((downloadURL) => {
          setPhotoURL(downloadURL);
        });
        updateButton.classList.remove('button-loading');
        updateButton.removeChild(spinner);
        setPreviewPhoto(null);
        onUpdate([name, major, year, selectedCompanies, selectedTags, photoURL, userData[6]]); 
      }
    )
  };

  const handleCompanyChange = (e) => {
    const selectedCompany = e.target.value;
    if (selectedCompanies.includes(selectedCompany)) {
      // If the selected company already exists, remove it
      setSelectedCompanies(selectedCompanies.filter(company => company !== selectedCompany));
    } else {
      // Otherwise, add it to the selected companies
      setSelectedCompanies([...selectedCompanies, selectedCompany]);
    }
  };
  
  const handleTagChange = (e) => {
    const selectedTag = e.target.value;
    if (selectedTags.includes(selectedTag)) {
      // If the selected tag already exists, remove it
      setSelectedTags(selectedTags.filter(tag => tag !== selectedTag));
    } else {
      // Otherwise, add it to the selected tags
      setSelectedTags([...selectedTags, selectedTag]);
    }
  };

  const handleFormCompanyClick = (e) => {
    const selectedCompany = e;
    if (selectedCompanies.includes(selectedCompany)) {
      // If the selected company already exists, remove it
      setSelectedCompanies(selectedCompanies.filter(company => company !== selectedCompany));
    }
  }

  const handleFormTagClick = (e) => {
    const selectedTag = e;
    if (selectedTags.includes(selectedTag)) {
      // If the selected tag already exists, remove it
      setSelectedTags(selectedTags.filter(tag => tag !== selectedTag));
    } 
  }

  const handlePhotoChange = (e) => {
    if (e.target.files[0] ){
      setPhoto(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (r) => {
        setPreviewPhoto(r.target.result);
      }
      reader.readAsDataURL(e.target.files[0]);
    }

  }

  const handleFileDrop = (e) => {
    e.preventDefault();
    const validTypes = ['image/jpeg', 'image/png'];
    if (e.dataTransfer.files[0]){
      if (validTypes.includes(e.dataTransfer.files[0].type)){
        setPhoto(e.dataTransfer.files[0]);
        const reader = new FileReader();
        reader.onload = (r) => {
          setPreviewPhoto(r.target.result);
        }
        reader.readAsDataURL(e.dataTransfer.files[0]);
      }
      else{
        alert("Only PNG and JPEG accepted");
      }
    }
  }

  const mouseEnter = (e) => {
    e.target.style.opacity = ".8";
  }

  const mouseLeave = (e) => {
    e.target.style.opacity = "1";
  }

  const mouseDown = (e) => {
    e.target.style.background = "linear-gradient(to top, rgb(0, 54, 155), rgb(54, 110, 212))";
  }

  const mouseUp = (e) => {
    e.target.style.background = "linear-gradient(to top, rgb(0, 89, 255), rgb(110, 159, 250))";
  }

//   const handleCompanyRemove = (companyToRemove) => {
//     setSelectedCompanies(selectedCompanies.filter(company => company !== companyToRemove));
//   };

//   const handleTagRemove = (tagToRemove) => {
//     setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
//   };

  return (
    <div className="user-info-form">
      <div className="user-info-input-fields">

        <h1 id='uidd-header'>Input User Data</h1>
        <p id='uidd-sub'>Here you can change your account information</p>

        <div className="input-group">
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="input-group double-input-group">
          <div>
            <label>Major:</label>
            <input type="text" value={major} onChange={(e) => setMajor(e.target.value)} />
          </div>
          <div>
            <label>Year:</label>
            <input type="number" value={year} min="1900" max="2030" step="1" onChange={(e) => setYear(e.target.value)}/>
          </div>
        </div>

        <div className="input-group double-input-group">
          <div>
            <label>Company:</label>
            <select onChange={handleCompanyChange}>
              <option value="">Select Company</option>
              {companies.map((company, index) => (
                <option key={index} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Tags:</label>
            <select onChange={handleTagChange}>
              <option value="">Select Tag</option>
              {tags.map((tag, index) => (
                <option key={index} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div id="user-info-possible-tags">
          {selectedCompanies.map((company, index) => (
            <p className="form-tag" key={index} value={company} onClick={() => handleFormCompanyClick(company)}>
              {company}
            </p>
          ))}
          {selectedTags.map((tag, index) => (
            <p className="form-tag" key={index} value={tag} onClick={() => handleFormTagClick(tag)}>
              {tag}
            </p>
          ))}
        </div>

        <div class="photo-upload-container"
        onDrop={handleFileDrop} 
        onClick={() => document.getElementById("photo-input").click()}
        onDragOver={(e) => e.preventDefault()}>
          {(previewPhoto) ?
          (
            <img id="preview-image" src={previewPhoto} alt="Preview" />
          ):
          (
            
            <p class="upload-text">Click or drag a photo here</p>
          )
          }
          <input type="file" id="photo-input" accept="image/*" onChange={handlePhotoChange}/>
        </div>
        <button id="user-info-update-button" onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onMouseDown={mouseDown} onMouseUp={mouseUp} onClick={handleUpdate}>Update</button>
      </div>

      <div className="user-info-display-data">
        <h1 id='uidd-header'>Current User Data</h1>
        <p id='uidd-sub'>Here is your currently saved account information</p>
        <div className='image-and-basics'>
          {photoURL && <img className='user-info-profile-photo' src={photoURL} alt="Uploaded" />}
          <div id="user-info-basics">
            <div>
              <p className='uib-head'><strong>Name</strong></p>
              <p className='uib-sub'>{userData[0]}</p>
            </div>
            <div>
              <p className='uib-head'><strong>Email</strong></p>
              <p className='uib-sub'>{userData[6]}</p>
            </div>
            <div>
              <p className='uib-head'><strong>Major</strong></p>
              <p className='uib-sub'>{userData[1]}</p>
            </div>
            <div>
              <p className='uib-head'><strong>Year</strong></p>
              <p className='uib-sub'>{userData[2]}</p>
            </div>
          </div>
        </div>
        <p className='ct-head'><strong>Companies</strong></p>
        <p className='ct-sub'>{userData[3].join(', ')}</p>
        <p className='ct-head'><strong>Tags</strong></p>
        <p className='ct-sub'>{userData[4].join(', ')}</p>
      </div>
    </div>
  );
}

function UserInfo() {
  const location = useLocation();
  const navigate = useNavigate();
  let uid = location.state.uid;
  let initialUserData = ["", "", 2025, [], [], "", ""];

  useEffect(() => {
    const fetchUserInfo = async () => {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      const allData = docSnap.data();
      setUserData([allData.firstName, allData.major, allData.gradYear, allData.companies, allData.studentOrgs, allData.photoURL, allData.email]);
    };

    fetchUserInfo();
  }, []);


  const [userData, setUserData] = useState(initialUserData);
  const [companies, setCompanies] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      const companiesRef = doc(db, 'companies', 'companies');
      const companiesSnap = await getDoc(companiesRef);
      const companiesData = companiesSnap.data();
      const companiesNames = Object.keys(companiesData).sort();
      setCompanies(companiesNames);
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      const tagsRef = doc(db, 'studentOrgs', 'studentOrgs');
      const tagsSnap = await getDoc(tagsRef);
      const tagsData = tagsSnap.data();
      const tagsNames = Object.keys(tagsData).sort();
      setTags(tagsNames);
    };

    fetchTags();
  }, []);

  const handleUpdate = (newData) => {
    setUserData(newData);
    const data = {
      companies: newData[3],
      firstName: newData[0],
      gradYear: newData[2],
      major: newData[1],
      studentOrgs: newData[4],
      photoURL: newData[5]
    };
    updateDoc(doc(db, "users", uid), data);
  };

  const mouseEnter = (e) => {
    e.target.style.opacity = ".8";
  }

  const mouseLeave = (e) => {
    e.target.style.opacity = "1";
  }

  const mouseDown = (e) => {
    e.target.style.background = "linear-gradient(to top, rgb(0, 54, 155), rgb(54, 110, 212))";
  }

  const mouseUp = (e) => {
    e.target.style.background = "linear-gradient(to top, rgb(0, 89, 255), rgb(110, 159, 250))";
  }

  return (
    <div className="user-info-container">
      <UserInfoForm userData={userData} onUpdate={handleUpdate} companies={companies} tags={tags} />
      <button id="user-info-home-button" onClick={() => {navigate("/Homepage", {state: {uid: uid}})}}
        onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onMouseDown={mouseDown} onMouseUp={mouseUp}
        >🏠︎</button>
    </div>
  );
}

export default UserInfo;
