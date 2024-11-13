import MasterComponent from '../MasterComponent';
import MenuComponent from '../menu/MenuComponent';
import FooterComponent from '../footer/FooterComponent';
import React, { useState } from 'react';
import './AboutComponent.css';
import Avatar from './images/Avatar.jpg';

const AboutComponent = () => {
  const members = [
    {
      id: 1,
      name: 'Kausar',
      role: 'Backend & Assisting Front End',
      responsibilities: 'Backend development and API integration.',
      image: Avatar
    },
    {
      id: 2,
      name: 'Pooja',
      role: 'Backend & JIRA Management',
      responsibilities: 'Handling backend development and managing JIRA pages.',
      image: Avatar
    },
    {
      id: 3,
      name: 'Michael',
      role: 'Software Tester & Assisting Front End',
      responsibilities: 'Assisting front-end team, creating About Us and Contact pages, and writing test cases.',
      image: Avatar
    },
    {
      id: 4,
      name: 'Joshua',
      role: 'Front End Developer',
      responsibilities: 'Creating the Project screen and working on front-end components.',
      image: Avatar
    },
    {
      id: 5,
      name: 'Girish',
      role: 'Front End Developer',
      responsibilities: 'Developing the Landing and Progress Tracking screens.',
      image: Avatar
    },
    {
      id: 6,
      name: 'Aman',
      role: 'Mobile UI & Recommendation System',
      responsibilities: 'Designing the mobile UI and implementing the recommendation system.',
      image: Avatar
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
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
  {members.map((member) => (
    <div
      key={member.id}
      style={{
        border: '1px solid #ccc',
        padding: '10px',
        width: '300px',
        borderRadius: '5px',
        textAlign: 'center',
      }}
    >
      <div>
        <img
          src={member.image}
          alt={`${member.name}'s profile`}
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '5px',
          }}
        />
      </div>
      <h3>{member.name}</h3>
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