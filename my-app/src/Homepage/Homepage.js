import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './Homepage.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from "firebase/firestore";
let tags = [];
let uid;

const Corner = ({ onProfileClick, photoUID}) => {
  const [profileURL, setProfileURL] = useState();

  useEffect(() => {
    const fetchProfileURL = async () => {
      const docRef = doc(db, "users", photoUID);
      const docSnap = await getDoc(docRef);
      const allData = docSnap.data();
      setProfileURL(allData.photoURL);
    }

    fetchProfileURL();
  })

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
      <img src={profileURL} onClick ={onProfileClick} alt="Profile Picture" 
      id="homepage-profile-photo"
      onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onMouseDown={mouseDown} onMouseUp={mouseUp}/>
  );
};

const ChatIcon = ({ onMessageClick }) => {
  const mouseEnter = (e) => {
    e.target.style.opacity = ".8";
  };

  const mouseLeave = (e) => {
    e.target.style.opacity = "1";
  };

  const mouseDown = (e) => {
    e.target.style.background = "linear-gradient(to top, rgb(0, 54, 155), rgb(54, 110, 212))";
  };

  const mouseUp = (e) => {
    e.target.style.background = "linear-gradient(to top, rgb(0, 89, 255), rgb(110, 159, 250))";
  };

  return (
    <img
      alt=""
      className="chat-icon"
      onClick={onMessageClick}
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
      onMouseDown={mouseDown}
      onMouseUp={mouseUp}
    />
  );
};


const SearchBar = ({ toggleFilterSettings }) => {
  let navigate = useNavigate();
  let location = useLocation()

  const searchClicked = () => {
    let search_value = document.getElementById("search-input").value;
    navigate("/Search", {state: {old_tags: tags, search: search_value, uid: location.state.uid}});
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

  const mouseEnterLogo = (e) => {
    e.target.style.color = "rgb(255, 145, 0)";
    e.target.style.transform = "scale(1.05)";

  }

  const mouseLeaveLogo = (e) => {
    e.target.style.color = "rgb(0, 89, 255)";
    e.target.style.transform = "scale(1)";
  }

  return (
    <div className="logo-and-search">
      <div id="homepage-logo">
        Find your next <p id="homepage-logo-value" onMouseEnter={mouseEnterLogo} onMouseLeave={mouseLeaveLogo}>Gator</p>
      </div>
      <div className="search-controls">
        <button className="homepage-search-button" onClick={toggleFilterSettings}
        onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onMouseDown={mouseDown} onMouseUp={mouseUp}>
          Filter
        </button>
        <button className="homepage-search-button" onClick={() => searchClicked()}
        onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onMouseDown={mouseDown} onMouseUp={mouseUp}>
            Search
        </button>
        <input type="text" placeholder="Search..." className="search-input" id="search-input"/>
      </div>
    </div>
  );
};

const FilterSettings = () => {
  const [companies, setCompanies] = useState([]);
  const [filterTags, setFilterTags] = useState([]);

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

  const [studentOrgs, setStudentOrgs] = useState([]);

  useEffect(() => {
    const fetchStudentOrgs = async () => {
      const studentOrgsRef = doc(db, 'studentOrgs', 'studentOrgs');
      const studentOrgsSnap = await getDoc(studentOrgsRef);
      const studentOrgsData = studentOrgsSnap.data();
      const studentOrgsNames = Object.keys(studentOrgsData).sort();
      setStudentOrgs(studentOrgsNames);
    };

    fetchStudentOrgs();
  }, []);

  const filterOptions = {
    majors: ['Accounting', 'Advertising', 'Aerospace Engineering', 'African American Studies', 'African Languages', 'Agricultural Education/Communication',
            'Agricultural Operations Management', 'Animal Sciences', 'Anthopology', 'Applied Physiology and Kinesiology', 'Arabic', 'Architecture',
            'Art History', 'Art', 'Astronomy and Astrophysics', 'Biological Engineering', 'Biology', 'Biomedical Engineering', 'Business Administration', 
            'Chemical Engineering', 'Chemistry', 'Chinese', 'Civil Engineering', 'Classical Studies', 'Communication Sciences and Disorders', 'Computer Engineering',
            'Computer Science', 'Construction Management', 'Criminology', 'Dance', 'Data Science', 'Dietetics', 'Digital Arts and Sciences', 'Dual Languages', 
            'Early Childhood Education', 'Economics', 'Education Sciences', 'Electrical Engineering', 'Elementary Education', 'Engineering', 'English', 'Entomology and Nematology',
            'Enviornmental Engineering', 'Environmental Science', 'Family, Youth and Community Sciences', 'Finance', 'Fire and Emergency Services', 'Food and Resource Economics',
            'Food Science', 'Foreign Languages and Literatures', 'Forest Resources and Conservation', 'French and Francophone Studies', 'Geography', 'Geology', 'Geomatics',
            'German', 'Graphic Design', 'Health Education and Behavior', 'Health Science', 'Hebrew', 'Hispanic and Latin American Languages, Literatures and Linguistics',
            'History', 'Industrial and Systems Engineering', 'Information Systems', 'Interdisciplinary Studies', 'Interior Design', 'International Studies', 'Italian',
            'Japanese', 'Jewish Studies', 'Journalism', 'Linguistics', 'Management', 'Marine Sciences', 'Marketing', 'Materials Science and Engineering', 'Mathematics', 
            'Mechanical Engineering', 'Media Production, Management, and Technology', 'Meteorology', 'Microbiology and Cell Science', 'Music Education', 
            'Music', 'Natural Resource Conservation', 'Nuclear Engineering', 'Nursing', 'Nutritional Sciences', 'Pharmacy', 'Philosophy', 'Physics', 'Plant Science',
            'Political Science', 'Portugese', 'Psycology', 'Public Health', 'Public Relations', 'Religion', 'Russian', 'Sociology', 'Soil, Water, and Ecosystem Sciences',
            'Spanish', 'Spanish and Portugese', 'Sport Management', 'Statistics', 'Sustainability and the Built Environment', 'Sustainability Studies', 'Theatre', 
            'Theatre Performance', 'Theatre Production', 'Tourism, Hospitality and Event Management', 'Wildlife Ecology and Conservation', 'Women\'s Studies', 'Zoology'
            ]
    // companies: ['Google', 'Microsoft', 'Apple', 'Amazon'],
    // studentOrganizations: ['IEEE', 'ACM', 'Beta Alpha Psi', 'SWE'],
  };

  const handleAddTag = (type, value) => {

    if (value === "") {
      alert("You must choose a value.");
    }
    else if(filterTags.findIndex((tag) => tag.value === value) !== -1){
      alert("This filter is already applied");
    }
    else{ // This would be changed
      const newTag = { type, value };
      setFilterTags([...filterTags, newTag]);
      tags = [...filterTags, newTag];
    }

  };

  const removeTag = (type, value) => { // This would be changed
    setFilterTags(filterTags.filter(tag => !(tag.type === type && tag.value === value)));
    tags = filterTags.filter(tag => !(tag.type === type && tag.value === value));
  };

  return (
    <div id="filter-settings">
      <div id="homepage-add-filters">
        <div className="filter-section">
          <h1 className="homepage-filter-section-head">Major</h1>
          <div className="filter-right-side">
            <select id="major-select" className="filter-select">
              <option value="">Select...</option>
              {filterOptions.majors.map((major, index) => (
                <option key={index} value={major}>{major}</option>
              ))}
            </select>
            <button className="add-tag" onClick={() => handleAddTag('Major', document.getElementById('major-select').value)}>Add</button>
          </div>
        </div>
        <div className="filter-section">
          <h1 className="homepage-filter-section-head">Grad Year</h1>
          <div className="filter-right-side">
            <input id="graduationYear-select" className="filter-select" type="number" min="1900" max="2030" step="1" defaultValue="2024" />
            <button className="add-tag" onClick={() => handleAddTag('Graduation Year', document.getElementById('graduationYear-select').value)}>Add</button>
          </div>
        </div>
        <div className="filter-section">
          <h1 className="homepage-filter-section-head">Company</h1>
          <div className="filter-right-side">
            <select id="company-select" className="filter-select" style={{margin: 0}}>
              <option value="">Select...</option>
              {companies.map((company, index) => (
                <option key={index} value={company}>{company}</option>
              ))}
            </select>
            <button className="add-tag" onClick={() => handleAddTag('Company', document.getElementById('company-select').value)}>Add</button>
          </div>
        </div>
        <div className="filter-section">
          <h1 className="homepage-filter-section-head">Student Orgs</h1>
          <div className="filter-right-side">
            <select id="studentOrganization-select" className="filter-select">
              <option value="">Select...</option>
              {studentOrgs.map((org, index) => (
                <option key={index} value={org}>{org}</option>
              ))}
            </select>
            <button className="add-tag" onClick={() => handleAddTag('Student Org', document.getElementById('studentOrganization-select').value)}>Add</button>
          </div>
        </div>
      </div>

      <div className="homepage-selected-tags">
        {filterTags.map((tag, index) => (
          <Tag key={index} type={tag.type} value={tag.value} removeTag={() => removeTag(tag.type, tag.value)} />
        ))}
      </div>
    </div>
  );
};

const Tag = ({ type, value, removeTag }) => {
  return (
    <div className="homepage-filter-tag" onClick={removeTag}>
      <p className='hft-top'>{type}</p>
      <p className='hft-bottom'>{value}</p>
    </div>
  );
};

// const Popup = ({showPopup, onClose}) => {
//   const [flaskTest, setFlaskTest] = useState("");

//   // Just testing to see if I can get the flask server to work
//   useEffect(() => {
//     fetch("/user-data")
//       .then((res) => {
//         console.log(res)
//         return res.json();
//       })
//       .then((data) => {
//         console.log(data)
//         setFlaskTest(data.hello)
//       })
//   }, [])

//   if (!showPopup) return null;

//   const handleClose = () => {
//     onClose();
//   };
//   return createPortal(
//     <div className="modal-overlay">
//       <div className="modal">
//         <div>Current UID is {uid}</div>
//         <div>{flaskTest}</div>
//         <button onClick={handleClose}>Close</button>
//       </div>
//     </div>,
//     document.body
//   );
// };

const Homepage = () => {
  const [showFilterSettings, setShowFilterSettings] = useState(false);
  //const[showPopup, setShowPopup] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  uid = location.state.uid;

  const handleProfileClick = () => {
    //setShowPopup(true);
    navigate("/UserInfo", {state: {uid: uid}})
  };

  const handleMessagesClick = () => {
    navigate("/Messages", {state: {uid: uid}});
  };
  // const handleClosePopup = () => {
  //   setShowPopup(false);
  // };

  const toggleFilterSettings = () => {

    const filterSettings = document.getElementById("filter-settings");

    if (showFilterSettings){
      filterSettings.style.top = "150%";
    }
    else{
      filterSettings.style.top = "70%";
    }

    setShowFilterSettings(!showFilterSettings);
  };

  return (
    <div id="homepage-container">
      <Corner onProfileClick = {handleProfileClick} photoUID={uid}/>
      <SearchBar toggleFilterSettings={toggleFilterSettings} />
      <FilterSettings />
      <ChatIcon onMessageClick = {handleMessagesClick} />
    </div>
  );
};

export default Homepage;