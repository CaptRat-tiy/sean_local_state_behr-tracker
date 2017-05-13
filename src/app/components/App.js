"use strict";

import React from 'react';
import _ from 'underscore';
import * as firebase from 'firebase'

import Student from './Student'
import Behaviors from './Behaviors'
import About from './About'
import Footer from './Footer'
import Routing from './Routing'


import styles from '../styles/App.css';

var config = {
    apiKey: "AIzaSyAjB5xxpo_eOVJ7LFoDJUN51TGXyhkq1IQ",
    authDomain: "behavioral-tracker-app.firebaseapp.com",
    databaseURL: "https://behavioral-tracker-app.firebaseio.com",
    projectId: "behavioral-tracker-app",
    storageBucket: "behavioral-tracker-app.appspot.com",
    messagingSenderId: "119916788968"
  };

firebase.initializeApp(config);

const fbRef= firebase.database().ref();

export default class App extends React.Component {
  constructor(){
    super();
    this.changeIntoArray=this.changeIntoArray.bind(this)
    this.handleBehaviorClick=this.handleBehaviorClick.bind(this)
    this.handleStudentClick=this.handleStudentClick.bind(this)

    this.state = {
      courseData: {},
      students: [],
      teacherInfo: {},
      behaviors: []
    }
  }

  componentWillMount(){
    fbRef.on("child_added", (snapshot)=>{
      const courseData = this.changeIntoArray(snapshot.val())
      const students = this.changeIntoArray(snapshot.val().studentArray)
      const teacherInfo = snapshot.val().teacherID
      const behaviors = this.changeIntoArray(snapshot.val().behaviors)
      this.setState({
        courseData: courseData,
        students: students,
        teacherInfo: teacherInfo,
        behaviors: behaviors
      })
    })
  }


  changeIntoArray(object){
    const newArray = []
    _.map(object, function(c,i,a){
      newArray.push(c)
    })
    return newArray
  }

  handleStudentClick(student){
     console.log(student);
  }

  handleBehaviorClick(behavior){
      let d=new Date()
     console.log(d.getMonth()+1 + "/", d.getDate() + "/", d.getFullYear())
     let timestamp = Date.now()
     const behaviorID = fbRef.child("courseID")
     const behaviorIDTest=behaviorID.child(0)
     const tacoTest=behaviorIDTest.push().key
     let behaviorUpdate={}
     behaviorUpdate["courseID/studentArray/"+tacoTest] = {
       month: 7,
       time: "9am",
       year: 2016,
       behavior:behavior
     }
     fbRef.update(behaviorUpdate)
  }



  render () {
    const students=this.state.students
    const courseData=this.state.courseData
    const teacherInfo=this.state.teacherInfo
    const behaviors=this.state.behaviors

    return (
      <div className="body">
        <div className="mainYellow">
          <div className="courseInfoLightGreen">
            <h1>{teacherInfo.firstName} {teacherInfo.lastName}'s Grade {teacherInfo.gradeLevel} Class</h1>
          </div>

          <div>
            {students.map((student, index)=>{
            return <Student
                key={index}
                student={student}
                behaviors={behaviors}
                handleBehaviorClick={this.handleBehaviorClick} />
              }
            )}
          </div>

          <div className="studentSelectorButtonsPinkBackground">
            <p>Please select the student you wish to monitor:</p>

            {students.map((studentObject, index)=>{
              return <button key={studentObject.lastName} onClick={() => this.handleStudentClick(studentObject.firstName)} >{studentObject.firstName} {studentObject.lastName}</button>
              }
            )}
          </div>

          <div className="footer">
            This qualifies as a footer
          </div>

        </div>
      </div>
    )
  }
}
