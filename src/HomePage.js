import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, monitorAuthState, db, doc, getDoc } from './firebase'; // Import Firebase utilities
import './App.css';
import './HomePage.css';
import logo from './images/logo.png';
import hospital from './images/hospital.png';
import personProfile from './images/personProfile.png';

const HomePage = () => {
  const [userName, setUserName] = useState(''); // Store user's name or default value
  const [loading, setLoading] = useState(true); // Track loading state
  const navigate = useNavigate(); // Initialize React Router navigation

  /**
   * Fetch the user's full name from Firestore using their UID.
   * @param {string} uid - The user’s unique ID.
   */
  const fetchUserName = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid)); // Retrieve user data
      if (userDoc.exists()) {
        const { fullName } = userDoc.data(); // Extract full name from Firestore
        setUserName(fullName); // Set full name in state
      } else {
        console.warn('No user data found in Firestore.');
        setUserName('Guest'); // Default to 'Guest' if no data found
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserName('Guest'); // Default to 'Guest' on error
    } finally {
      setLoading(false); // Set loading to false after fetching completes
    }
  };

  useEffect(() => {
    const unsubscribe = monitorAuthState((user) => {
      if (user) {
        fetchUserName(user.uid); // Fetch user's name if logged in
      } else {
        setUserName('Guest'); // Default to 'Guest' if no user logged in
        setLoading(false); // Stop loading
      }
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, []);

  // Navigate to HospitalMapPage
  const handleLocateHospital = () => {
    navigate('/hospitals');
  };

  return (
    <div className="App">
      {/* Header Section */}
      <header className="header">
        <div className="logo">
          <img src={logo} alt="MediMAP Logo" />
        </div>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About Us</a>
          <a href="/history">History</a>
          <a href="/email">Email</a>
          <a href="/profile">
            <img src={personProfile} alt="Profile" />
          </a>
        </nav>
      </header>

      {/* Welcome Section */}
      <section className="welcome-section">
        {loading ? (
          <h1>Loading...</h1> // Display loading message while fetching data
        ) : (
          <h1>Welcome, {userName}!</h1>
        )}
        <p>Check out these first aid tutorials for emergency situations.</p>
      </section>

      {/* Content Container */}
      <div className="content-container">
        <section className="tutorial-container">
          <div className="tutorial-row">
            {[
              { title: 'Handle burn injuries', imgSrc: './img2.jpg', link: 'https://www.youtube.com/watch?v=zaDkQ6SFJpQ&pp=ygUMaGFuZGxlIGJ1cm5z' },
              { title: 'Handle choking', imgSrc: './img1.jpg', link: 'https://www.youtube.com/watch?v=MkTZlRyXQiY&pp=ygUOaGFuZGxlIGNob2tpbmc%3D' },
            ].map((tutorial, index) => (
              <div key={index} className="card">
                <a href={tutorial.link} target="_blank" rel="noopener noreferrer">
                  <img src={tutorial.imgSrc} alt={tutorial.title} />
                  <p>{tutorial.title}</p>
                </a>
              </div>
            ))}
          </div>

          <div className="tutorial-row">
            {[
              { title: 'Guide to do proper CPR', imgSrc: './img3.jpg', link: 'https://www.youtube.com/watch?v=Plse2FOkV4Q&pp=ygUTZ3VpZGUgdG8gcHJvcGVyIGNwcg%3D%3D' },
              { title: 'Handle fracture', imgSrc: './img4.jpg', link: 'https://www.youtube.com/watch?v=2v8vlXgGXwE&pp=ygUPaGFuZGxlIGZyYWN0dXJl' },
            ].map((tutorial, index) => (
              <div key={index} className="card">
                <a href={tutorial.link} target="_blank" rel="noopener noreferrer">
                  <img src={tutorial.imgSrc} alt={tutorial.title} />
                  <p>{tutorial.title}</p>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Locate Hospital Section */}
        <section className="locate-hospital">
          <div className="hospital-image">
            <img src={hospital} alt="Hospital" />
          </div>
          <button className="locate-button" onClick={handleLocateHospital}>
            Locate nearest hospital now!
          </button>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
