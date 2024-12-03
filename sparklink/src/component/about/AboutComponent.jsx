import MasterComponent from '../MasterComponent';
import MenuComponent from '../menu/MenuComponent';
import FooterComponent from '../footer/FooterComponent';
import React from 'react';
import './AboutComponent.css'
import Pooja from './images/Pooja.jpg';
import Gireesh from './images/Gireesh.jpg';
import Avatar from './images/Avatar.jpg';
import Joshua from './images/Joshua.jpeg';
import Micheal from './images/Micheal.jpeg';
import Kausar from './images/Kausar.jpg';

const AboutComponent = () => {
  const members = [
    {
      id: 1,
      name: 'Kausar Fatema',
      role: 'Backend & Assisting Front End',
      responsibilities: 'Backend development and API integration.',
      image: Kausar,
      LinkedIn: 'https://www.linkedin.com/in/kausar-fatema-9060871b1/',
    },
    {
      id: 2,
      name: 'Pooja Vishwakarma',
      role: 'Backend & JIRA Management',
      responsibilities: 'Handled backend development and managed JIRA pages.',
      image: Pooja,
      LinkedIn:'https://www.linkedin.com/in/pooja-vishwakarma95/',
    },
    {
      id: 3,
      name: 'Fajuko Michael',
      role: 'Software and QA Automation Tester',
      responsibilities: 'Assisted front-end team, created About Us page, and writing test cases.',
      image: Micheal,
      LinkedIn:'https://www.linkedin.com/in/fajuko-odunayo-5256a1265/',
    },
    {
      id: 4,
      name: 'Joshua Daniel',
      role: 'Front End Developer',
      responsibilities: 'Created the Project screen and worked on front-end components.',
      image: Joshua,
      LinkedIn:'https://www.linkedin.com/in/joshua-daniel1999/',
    },
    {
      id: 5,
      name: 'Gireesh Chandra',
      role: 'Front End Developer',
      responsibilities: 'Developed the Landing and Progress Tracking screens.',
      image: Gireesh,
      LinkedIn:'https://www.linkedin.com/in/gireesh-busam/',
    },
    {
      id: 6,
      name: 'Amanbhai Arifbhai',
      role: 'Mobile UI & Recommendation System',
      responsibilities: 'Designed the mobile UI and implemented the recommendation system.',
      image: Avatar,
      LinkedIn:'',
    },
  ];

  return (
    <>
      {/* <MasterComponent></MasterComponent> */}
      <MenuComponent></MenuComponent>
      <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
        <div className="container">
          <h1>About Us</h1>

          {/* Project Details */}
          <section>
            <h2>Project Overview</h2>
            <p>
              <strong>Project Title:</strong> UWindsor SparkLink – Empowering IT Solutions through Student Innovation
            </p>
            <p>
              UWindsor SparkLink is a platform designed to connect University of Windsor departments with Computer Science
              students for IT project support. It aims to provide hands-on experience to students while solving
              departmental IT challenges. Key features include project submission, skill-based matching, and paid
              opportunities for students.
            </p>
          </section>

          {/* Team Members */}
          <section>
            <h2>Our Team</h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)', // 3 cards per row
                gap: '20px', // Space between cards
                justifyContent: 'center', // Center the grid
                paddingLeft:"55px"
              }}
            >
              {members.map((member) => (
                <div
                  key={member.id}
                  style={{
                    border: '1px solid #ccc', 
                    padding: '10px',
                    width: '300px',
                    borderRadius: '5px',
                    textAlign: 'center',
                    backgroundColor: '#fff',
                  }}
                >
                  <div>
                    <img
                      src={member.image}
                      alt={`${member.name}'s profile`}
                      style={{
                        width: '100%',
                        height: '370px',
                        borderRadius: '5px',
                      }}
                    />
                  </div>
                  <h3>
                  <a
                      href={member.LinkedIn}
                      color='black'
                      rel="noopener noreferrer"
                      style={{ textDecoration: 'none', color: 'black' }}
                      className="member-link"
                    >
                      {member.name}
                    </a>
                  </h3>
                  <p>
                    <strong>Role:</strong> {member.role}
                  </p>
                  <p>{member.responsibilities}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <FooterComponent></FooterComponent>
    </>
  );
};

export default AboutComponent;
