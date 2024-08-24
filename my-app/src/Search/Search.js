import React, { useEffect, useState } from 'react';
import './Search.css';
import {storage, db} from "../firebase.js"
import { doc, getDoc } from "firebase/firestore";
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
              'Japanese', 'Jewish Studies', 'Journalism', 'Linguistics', 'Management', 'Marine Sciences', 'Marketing', 'Materials Science and Engineering', 'Mathmatics', 
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
      if (showFilterSettings){
        filterSettings.style.width = "0";
        filterSettings.style.padding = "0";
      }
      else{
        filterSettings.style.width = "30vw";
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

      try{
        const response = await fetch('https://gator-relator-flask.onrender.com/card-info', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(finalTags)
        })

        const res = await response.json();
        console.log(res);
        setCards(res);
      }
      catch (error){
        console.log(error);
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

    useEffect(() => {
      searchClicked(searchInput);
    }, []);
  
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
          <div className="card-container">
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
                  </div>
                );}
              )}
          </div>
        </div>
      </>
    );
  };

export default Search;