import React, { useState } from 'react';
import CalcUtils from './CalcUtils';

/* StudentPorfile will give the structure of each student profile rendered on the website */
function StudentProfile(studentData) {
  const [isExpanded, setIsExpanded] = useState(false);

  /* expand gives the functionality to see all grades rather than answer or vice-versa */
  function expand() {
    setIsExpanded(!isExpanded);
  }
  /* sendTagToStudents takes the added Tag by user and sends it to Students to add it in the main list of students*/
  function SendTagToStudents(e) {
    if (e.keyCode === 13) {
      studentData.handleNewTag({ "tag": e.target.value, "id": studentData.item.id });
      e.target.value = "";
    }
  }

  return (
    <div key={studentData.item.id}>
      <button className="button" onClick={expand}> {isExpanded ? <>-</> : <>+</>}</button>
      <div className="student-profile" >
        <div className="student-image">
          <img className="img-icon"
            src={studentData.item.pic}
            alt={studentData.item.id}>
          </img>
        </div>
        <div className="student-details">
          <h1>
            {studentData.item.firstName.toUpperCase()}
            {studentData.item.lastName.toUpperCase()}
          </h1>
          <div className="student-additionalDetails">
            <p>Email: {studentData.item.email} <br />
              Company: {studentData.item.company} <br />
              Skill: {studentData.item.skill} <br />
              {isExpanded ?
                studentData.item.grades.map((grade, key) => <span>Test{key + 1}: {grade}<br /></span>)
                :
                <span>Average: {CalcUtils.getAverage(studentData.item.grades)}</span>
              }<br />
            </p>
            {studentData.item.tags ?
              <div className="tags"><p> {studentData.item.tags.map(
                item => { return <span>{item} </span> })}</p></div>
              : <p></p>
            }
          </div>
          <input placeholder='Add a tag' onKeyUp={SendTagToStudents} />
        </div>
      </div>
    </div>
  )
}

/* export is exporting our student profile to Students to render*/
export default StudentProfile;
