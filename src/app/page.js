'use client';

import { useState, useEffect } from 'react';
import { Client, Databases, ID } from 'appwrite';

export default function Home() {
  const [formVisible, setFormVisible] = useState(true);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [tagline, setTagline] = useState('');
  const [joinCount, setJoinCount] = useState(0);
  const [taglineOpacity, setTaglineOpacity] = useState(1);
  const [thankYouVisible, setThankYouVisible] = useState(false);
  const [followUpVisible, setFollowUpVisible] = useState(false);

  useEffect(() => {
    // Set time-based tagline
    setTimeBasedTagline();
    
    // Initialize join count from localStorage
    const savedCount = localStorage.getItem('joinCount');
    setJoinCount(savedCount ? parseInt(savedCount) + 32 : 32);
  }, []);

  const setTimeBasedTagline = () => {
    const hour = new Date().getHours();
    let greeting = '';

    if (hour >= 5 && hour < 12) {
      greeting = 'good morning, sunshine';
    } else if (hour >= 12 && hour < 17) {
      greeting = 'hello, bright mind';
    } else if (hour >= 17 && hour < 22) {
      greeting = 'good evening, stargazer';
    } else {
      greeting = 'welcome, night owl';
    }
  
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i <= greeting.length) {
        setTagline(greeting.substring(0, i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 60);
  };

  const submitToWaitlist = async (firstName, email) => {
    try {
      const client = new Client();
      client
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

      const databases = new Databases(client);

      await databases.createDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
        process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
        ID.unique(),
        { "f_name": firstName, "email": email }
      );

      console.log('Form submitted:', { firstName, email });
    } catch (error) {
      console.error('Error submitting form:', error);
    }

    // Update the UI
    setTaglineOpacity(0);
    
    // Show confirmation after a delay
    setTimeout(() => {
      setFormVisible(false);
      setConfirmationVisible(true);
      
      setTimeout(() => {
        setThankYouVisible(true);
        
        setTimeout(() => {
          
          setTimeout(() => {
            setFollowUpVisible(true);
          }, 200);
        }, 800);
      }, 300);
    }, 600);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update join count
    const newJoinCount = joinCount + 1;
    setJoinCount(newJoinCount);
    localStorage.setItem('joinCount', newJoinCount - 32);
    
    const firstName = e.target.firstName.value.trim();
    const email = e.target.email.value.trim();
    
    if (!firstName || !email) return;
    
    submitToWaitlist(firstName, email);
  };

  return (
    <>
      <div className="background-gradient"></div>
      
      <main className="container">
        <div className="logo-container">
          <h1 className="logo">sola</h1>
          <p className="tagline" id="tagline-container" style={{ opacity: taglineOpacity }}>
            <span id="tagline">{tagline}</span>
          </p>
        </div>
        {formVisible && (
          <div className="glass-container" id="form-container" 
               style={{ 
                 display: formVisible ? 'block' : 'none', 
                 opacity: formVisible ? 1 : 0,
                 transform: formVisible ? 'translateY(0)' : 'translateY(10px)' 
               }}>
            <form id="waitlist-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="firstName">First name</label>
                <input type="text" id="firstName" name="firstName" required />
              </div>
              
              <div className="input-group">
                <label htmlFor="email">Email address</label>
                <input type="email" id="email" name="email" required />
              </div>
              
              <button type="submit" className="cta-button">
                <span>Join the waitlist</span>
              </button>
            </form>
          </div>
        )}
        
        {confirmationVisible && (
          <div className="confirmation-container" id="confirmation-container" 
               style={{ 
                 display: confirmationVisible ? 'block' : 'none', 
                 opacity: confirmationVisible ? 1 : 0,
                 transform: confirmationVisible ? 'translateY(0)' : 'translateY(20px)'
               }}>
            <p className="thank-you" style={{ 
                 opacity: thankYouVisible ? 1 : 0,
                 animation: thankYouVisible ? 'fadeInText 1s forwards' : 'none',
                 transform: !thankYouVisible && followUpVisible ? 'translateY(-20px)' : 'translateY(0)',
                 transition: 'opacity 0.8s ease, transform 0.8s ease'
               }}>
              Thank you.
            </p>
            <p className="follow-up" style={{ 
                 opacity: followUpVisible ? 1 : 0,
                 animation: followUpVisible ? 'fadeInText 1s forwards' : 'none'
               }}>
              The light's not far.
            </p>
          </div>
        )}
      </main>

      <footer>
        <p id="join-counter" className="join-counter">{joinCount} people have joined the movement.</p>
        <p>made with <span className="heart">♥</span> by sola team © 2025</p>
      </footer>
    </>
  );
}
