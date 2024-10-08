import React, { useEffect, useState } from 'react';
import './Search.css';
import {storage, db} from "../firebase.js"
import { doc, getDoc, getDocs, collection, setDoc, updateDoc, serverTimestamp} from "firebase/firestore";
import { ref, getDownloadURL } from 'firebase/storage';
import {useLocation, useNavigate} from 'react-router-dom';

  let tags = [];
  let searchInput = "";

  const SearchBar = ({ toggleFilterSettings, searchClicked }) => {

    const [searchValue, setSearchValue] = useState(searchInput);

    const handleSearch = () => {
      searchClicked(searchValue);
    }

    const handleSearchChange = (e) => {
      let value = e.target.value;
      setSearchValue(value);
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

    return (
      <div className="logo-and-search2">
        <div className="search-controls2">
          <button className="filter-button2" onClick={toggleFilterSettings} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onMouseDown={mouseDown} onMouseUp={mouseUp}>Filter</button>
          <button className="search-button2" onClick={() => {handleSearch()}} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onMouseDown={mouseDown} onMouseUp={mouseUp}>Search</button>
          <input type="text" placeholder="Search..." className="search-input2" defaultValue={searchInput} onChange={handleSearchChange}/>
        </div>
      </div>
    );
  };
  
  const FilterSettings = ({ addTag, removeTag }) => {
    const [companies, setCompanies] = useState([]);
    const [filterTags, setFilterTags] = useState(tags);
  
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
      else{ 
        const newTag = { type, value };
        setFilterTags([...filterTags, newTag]);
        addTag(type, value)
      }
  
    };
  
    const handleRemoveTag = (type, value) => { 
      setFilterTags(filterTags.filter(tag => !(tag.type === type && tag.value === value)));
      removeTag(type, value);
    };
  
    return (
      <div id="filter-settings2">
        <div id="search-add-filters2">
          <div className="filter-section2">
            <h1 className="search-filter-section-head2">Major</h1>
            <div className="filter-right-side2">
              <select id="major-select2" className="filter-select2">
                <option value="">Select...</option>
                {filterOptions.majors.map((major, index) => (
                  <option key={index} value={major}>{major}</option>
                ))}
              </select>
              <button className="add-tag2" onClick={() => handleAddTag('Major', document.getElementById('major-select2').value)}>Add</button>
            </div>
          </div>
          <div className="filter-section2">
            <h1 className="search-filter-section-head2">Grad Year</h1>
            <div className="filter-right-side2">
              <input id="graduationYear-select2" className="filter-select2" type="number" min="1900" max="2030" step="1" defaultValue="2024" />
              <button className="add-tag2" onClick={() => handleAddTag('Graduation Year', document.getElementById('graduationYear-select2').value)}>Add</button>
            </div>
          </div>
          <div className="filter-section2">
            <h1 className="search-filter-section-head2">Company</h1>
            <div className="filter-right-side2">
              <select id="company-select2" className="filter-select2" style={{margin: 0}}>
                <option value="">Select...</option>
                {companies.map((company, index) => (
                  <option key={index} value={company}>{company}</option>
                ))}
              </select>
              <button className="add-tag2" onClick={() => handleAddTag('Company', document.getElementById('company-select2').value)}>Add</button>
            </div>
          </div>
          <div className="filter-section2">
            <h1 className="search-filter-section-head2">Student Orgs</h1>
            <div className="filter-right-side2">
              <select id="studentOrganization-select2" className="filter-select2">
                <option value="">Select...</option>
                {studentOrgs.map((org, index) => (
                  <option key={index} value={org}>{org}</option>
                ))}
              </select>
              <button className="add-tag2" onClick={() => handleAddTag('Student Org', document.getElementById('studentOrganization-select2').value)}>Add</button>
            </div>
          </div>
        </div>

        <div className="search-selected-tags">
          <p className='search-filter-section-head2'>Applied Tags</p>
          <div id="search-selected-tags-container">           
            {filterTags.map((tag, index) => (
            <Tag key={index} type={tag.type} value={tag.value} removeTag={() => handleRemoveTag(tag.type, tag.value)} />
            ))}
          </div>
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
  
  const Search = () => {
    const location = useLocation();
    const navigate = useNavigate();
    tags = location.state.old_tags;
    searchInput = location.state.search;
    const [showFilterSettings, setShowFilterSettings] = useState(false);
    const [cards, setCards] = useState([])
    const [filterTags, setFilterTags] = useState(location.state.old_tags);
  
    const toggleFilterSettings = () => {
      const filterSettings = document.getElementById("filter-settings2");
      const cardContainer = document.getElementById("card-container");
      if (showFilterSettings){
        filterSettings.style.width = "0";
        filterSettings.style.padding = "0";
        cardContainer.style.width="100vw";
        cardContainer.style.padding = "3vh 3vw";
      }
      else{
        if (window.screen.width < 850){
          filterSettings.style.width = "100vw";
          cardContainer.style.width="0";
          cardContainer.style.padding = "0";
        }
        else{
          filterSettings.style.width = "30vw";
        }
        filterSettings.style.padding = "8px";
      }
      setShowFilterSettings(!showFilterSettings);
    };
  
    const addTag = (type, value) => {
        const newTag = { type, value };
        setFilterTags([...filterTags, newTag]);
    };
  
    const removeTag = (type, value) => {
      setFilterTags(filterTags.filter(tag => !(tag.type === type && tag.value === value)));
      tags = filterTags.filter(tag => !(tag.type === type && tag.value === value));
      location.state.old_tags = tags;
    };

    const searchClicked = async (value) =>{

      let finalTags = value.split(" ");
      finalTags = finalTags.filter(item => item !=="");

      for(const elmt of filterTags){
        finalTags.push(elmt.value);
      }

      console.log(finalTags); // This is an string array of uncategorized tags

      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);

      const validUsers = [];
      const indexCount = new Map();
      const final = [];

      usersSnapshot.forEach((doc) => {
        const userDict = doc.data();
        userDict.uid = doc.id;

        let userTags = userDict.firstName.split(' ')
          .concat(userDict.lastName.split(' '))
          .concat([String(userDict.gradYear), userDict.major]);

        userDict.companies.forEach(company => userTags.push(company));
        userDict.studentOrgs.forEach(org => userTags.push(org));

        finalTags.forEach(finalTags => {
          if (userTags.includes(finalTags)) {
            const userIndex = validUsers.indexOf(userDict);
            if (userIndex !== -1) {
              indexCount.set(userIndex, (indexCount.get(userIndex) || 0) + 1);
            } else {
              validUsers.push(userDict);
              indexCount.set(validUsers.length - 1, 1);
            }
          }
        });
      });

      
      const sortedIndexes = Array.from(indexCount.entries())
        .sort((a, b) => b[1] - a[1])
        .map(entry => entry[0]);

      sortedIndexes.forEach(index => final.push(validUsers[index]));

      setCards(final);

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

    useEffect(() => {
      searchClicked(searchInput);
    }, []);
  
    const handleDM = async (userInfo) => {
      console.log("User Info UID: ", userInfo.uid);
    
      const combinedId =
        location.state.uid > userInfo.uid
          ? location.state.uid + userInfo.uid
          : userInfo.uid + location.state.uid;
    
      try {
        // Check if the chat already exists
        const res = await getDoc(doc(db, "chats", combinedId));
    
        if (!res.exists()) {
          // If the chat doesn't exist, create it
          await setDoc(doc(db, "chats", combinedId), { messages: [] });
          console.log("Created new chat with ID: ", combinedId);
        }
    
        // Fetch current user's data (who is initiating the DM)
        const docRef = doc(db, "users", location.state.uid);
        const docSnap = await getDoc(docRef);
        const userData = docSnap.data();
        console.log("Current User Data: ", userData);
    
        // Ensure userChats document exists for the initiating user
        const userChatsRef = doc(db, "userChats", location.state.uid);
        const userChatsSnap = await getDoc(userChatsRef);
        if (!userChatsSnap.exists()) {
          await setDoc(userChatsRef, {});  // Create an empty document
          console.log("Created userChats for initiating user");
        }
    
        // Ensure userChats document exists for the receiving user
        const userChatsReceiverRef = doc(db, "userChats", userInfo.uid);
        const userChatsReceiverSnap = await getDoc(userChatsReceiverRef);
        if (!userChatsReceiverSnap.exists()) {
          await setDoc(userChatsReceiverRef, {});  // Create an empty document
          console.log("Created userChats for receiving user");
        }
    
        // Update the initiating user's chat data
        await updateDoc(userChatsRef, {
          [combinedId + ".userInfo"]: {
            uid: userInfo.uid,
            displayName: userInfo.firstName,
            photoURL: userInfo.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        console.log("Updated initiating user's chat data");
    
        // Update the receiving user's chat data
        await updateDoc(userChatsReceiverRef, {
          [combinedId + ".userInfo"]: {
            uid: location.state.uid,
            displayName: userData.firstName,
            photoURL: userData.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        console.log("Updated receiving user's chat data");
    
        // Navigate to the Messages page after successful updates
        navigate("/Messages", { state: { uid: location.state.uid } });
      } catch (err) {
        console.error("Error handling DM: ", err);
      }
    };


    return (
      <>
        <div className="header2" >
            <SearchBar toggleFilterSettings={toggleFilterSettings} searchClicked={searchClicked}/>
            <button id="search-home-button" onClick={() => {navigate("/Homepage", {state: {uid: location.state.uid}})}}
              onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onMouseDown={mouseDown} onMouseUp={mouseUp}
            >🏠︎</button>
        </div>

        <div className='non-header-container'>
          <FilterSettings addTag={addTag} removeTag={removeTag}/>
          <div id="card-container">
            {cards.map((cardInfo, index) => {
              return (
                  <div key={index} className='search-card'>
                    <img className='profile-photo-search' src={cardInfo.photoURL} alt='profile pic' />
                    <div className='search-basic-info'>
                      <div><span className='search-basic-info-type'>Name</span> - <span className='search-basic-info-value'>{cardInfo.firstName}</span></div>
                      <div><span className='search-basic-info-type'>Email</span> - <span className='search-basic-info-value'>{cardInfo.email}</span></div>
                      <div><span className='search-basic-info-type'>Graduation Year</span> - <span className='search-basic-info-value'>{cardInfo.gradYear}</span></div> 
                      <div><span className='search-basic-info-type'>Major</span> - <span className='search-basic-info-value'>{cardInfo.major}</span></div> 
                      <div><span className='search-basic-info-type'>Companies</span> - <span className='search-basic-info-value'>{cardInfo.companies.join(", ")}</span></div>
                      <div><span className='search-basic-info-type'>Organizations</span> - <span className='search-basic-info-value'>{cardInfo.studentOrgs.join(", ")}</span></div>
                    </div>
                    <button id ='add-to-chat-button' onClick = {() => handleDM(cardInfo)}/>
                  </div>
                );}
              )}
          </div>
        </div>
      </>
    );
  };

export default Search;