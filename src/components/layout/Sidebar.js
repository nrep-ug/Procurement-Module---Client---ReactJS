// src/components/layout/Sidebar.js
import React from 'react';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProjectDiagram, faTasks, faUsers, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import '../../assets/styles/Sidebar.css';  // We will add some basic styling here

const Sidebar = () => {
    return (
        <div className="sidebar">
            <Nav className="flex-column">
                <Nav.Item>
                    <Nav.Link as={Link} to="/projects">
                        <FontAwesomeIcon icon={faProjectDiagram} /> Projects
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/create-project">
                        <FontAwesomeIcon icon={faPlus} /> Create Project
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/projects/:projectID/tasks">
                        <FontAwesomeIcon icon={faTasks} /> Tasks
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link as={Link} to="/projects/:projectID/team">
                        <FontAwesomeIcon icon={faUsers} /> Team
                    </Nav.Link>
                </Nav.Item>
                {/* Add more links as needed */}
            </Nav>
        </div>
    );
};

export default Sidebar;
