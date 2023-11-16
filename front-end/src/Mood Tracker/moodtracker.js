import React, { useState } from 'react';
import axios from 'axios';
import "./mood.css";

<title>Mood Tracker!</title>
const MoodTracker = () => {
  const emojis = ['😔', '😐', '🙂', '😊', '😁'];

  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [message, setMessage] = useState(null)

  const handleClick = (emoji) => {
    setSelectedEmoji(emoji);
  };

  const submitMood = async () => {
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var datePosted = `${day}/${month}/${year}`;

    if(selectedEmoji) {

    try {
      const response = await axios.post("http://localhost:3001/api/moods/", {
        date: datePosted,
        mood: JSON.stringify(selectedEmoji)
      })
      if(response) {
        console.log("success")
        setMessage("Successfully submitted your mood.")
      }
    } catch (error) {
      console.error(error)
    }
  } else {
    setMessage("Please select your mood before submitting.")
  }
  }

  return (
    <div className='moodtracker-emoji'>
      <h2 className="Text1">The mood tracker below allows the user to select an emoji based upon your current mood. Over a course of 7 days an average will be calculated which will display your average mood over the past 7 days, which then you as the user can tell if your mood has improved from pervious weeks.</h2>
      <div className="MoodTracker"> <h1 className="Selectyouremoji">Select your emoji based on your current mood</h1>
        <div> {emojis.map((emoji) => ( 
        <span
          key={emoji}
          onClick={() => handleClick(emoji)}
          style={{
            cursor: 'pointer',
            color: selectedEmoji === emoji ? 'blue' : 'black',
            fontSize: '2rem',
          }} 
        >
          {emoji}
        </span>
      ))} </div></div>
      <button onClick={submitMood}>Enter</button>
      {message}
    </div>


  );
};

export default MoodTracker 