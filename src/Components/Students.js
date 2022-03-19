import React, { useState, useEffect } from 'react';
import StudentProfile from './StudentProfile';

/**
 * Students component provides a list view of all the students. 
 * It also allows filtering of student profiles based on name and/or tags.
 */
export default function Students() {

  /* StudentList contains whole list of students fetched from Hatchways' api 
     later tags are added to it 
     */
  const [studentList, setStudentList] = useState()

  /* searchedName is maintaining the state of name of the student searched */
  const [searchedName, setSearchedName] = useState();

  /* searchedTag is maintaining the state of tag searched*/
  const [searchedTag, setSearchedTag] = useState();

  useEffect(() => {
    if (studentList) {
      return;
    }

    //obtain list of all students and save it in student list
    fetch(`https://api.hatchways.io/assessment/students`).then(
      response => response.json()
    ).then(
      data => {
        setStudentList(data.students);
      });
  })

  /** rename fn name, remove all parameters
   * Following logic is used in search:
   * - start with all students and for each student, do:
   *    - if name is entered in search input, compare name with student name using first name, last name or full name
   *      - if student is matched (either because name is not searched for or because the current student is a match), perform tag match
   *      - if student is not matched, skip the current student
   *    - if name is not entered, proceed with tag comparison
   *    - if tag is entered, compare the entered tag with all tags present for the student
   *      - if tag is matched, add the current student to the filtered list of students
   *      - if tag is not matched, skip the current student 
   */
  const filterDataBySearch = () => {
    if (!searchedName && !searchedTag) {
      return studentList
    }

    let newStudentList = [];
    for (let i = 0; i < studentList.length; i++) {

      let student = studentList[i];
      let matched = true;

      if (searchedName && searchedName !== "") {
        if (!(student.firstName.toLowerCase().includes(searchedName.toLowerCase())
          || student.lastName.toLowerCase().includes(searchedName.toLowerCase())
          || (student.firstName.toLowerCase() + " " 
              + student.lastName.toLowerCase()).includes(searchedName.toLowerCase()))) {

          matched = false;
        }
      }

      if (matched === true && searchedTag && searchedTag !== "") {
        if (!student.tags) {
          matched = false;
        } else {
          for (let j = 0; j < student.tags.length; j++) {
            if (student.tags[j].includes(searchedTag)) {
              matched = true;
              break;
            } else {
              matched = false;
            }
          }
        }
      }

      if (matched === true) {
        newStudentList.push(student);
      }
    }
    return newStudentList;
  }

  /**
   *  processing new tags and adding it to our student List
   */
  const processNewTag = (tag) => {
    // we are cloning the student list so that React can detect the adition of new tag
    //(cloning always detaction of state change despite Reacts shallow evaluation)
    let newStudentList = JSON.parse(JSON.stringify(studentList))

    //filter studentList to get the student that matches on the id
    for (let i = 0; i < newStudentList.length; i++) {
      if (newStudentList[i].id === tag.id) {
        if (newStudentList[i].tags) {
          newStudentList[i].tags.push(tag.tag);
        } else {
          let tags = [tag.tag];
          newStudentList[i].tags = tags;
        }
        break;
      }
    }
    setStudentList(newStudentList);
  }

  const filteredStudentList = filterDataBySearch(studentList, searchedName, searchedTag);

  return (
    <div>
      <div className="wrapper">
        <div className="searchbar-div">
          <input
            className="searchbar"
            placeholder="Search by name"
            onChange={(event) => { setSearchedName(event.target.value) }}
            value={searchedName} />
          <input
            className="searchbar"
            placeholder="Search by tag"
            onChange={(event) => { setSearchedTag(event.target.value) }}
            value={searchedTag} />
        </div>
        {studentList != null ?
          (<React.Fragment>
            {filteredStudentList.map((item) => {
              return <StudentProfile item={item} handleNewTag={processNewTag} />
            })}
          </React.Fragment>)
          :
          <div><p>No student data available</p></div>
        }
      </div>
    </div>
  )
}


