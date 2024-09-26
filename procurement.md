To enable the form to be submitted to the server-side for saving, you can follow these steps:

1. **Add State Management:** Capture the form input values in the component's state.
2. **Handle Form Submission:** Create a function to handle the form submission and send the data to your server using an HTTP request (e.g., via `fetch` or `axios`).
3. **Connect to Backend API:** Ensure that your backend API endpoint is ready to receive the data and save it to the database.

Here's the updated `ProcurementForm` component with these capabilities:

```javascript
// src/components/ProcurementForm.js

import React, { useState } from 'react'
import { Form, Button, Col, Row, Alert } from 'react-bootstrap'
import DatePickerModal from './common/DatePickerModal'
import axios from 'axios'

const ProcurementForm = () => {
  const [showDatePicker, setShowDatePicker] = useState({
    show: false,
    field: ''
  })
  const [selectedDate, setSelectedDate] = useState({
    issuanceDate: '',
    submissionDeadline: '',
    questionsDeadline: '',
    contractAwardDate: ''
  })
  const [formData, setFormData] = useState({
    procurementTitle: '',
    referenceNumber: '',
    introduction: '',
    scopeOfWork: '',
    deliverables: '',
    submissionRequirements: '',
    evaluationCriteria: '',
    termsAndConditions: '',
    contactInformation: ''
  })
  const [submissionStatus, setSubmissionStatus] = useState(null)

  const handleDateSelect = (date, field) => {
    setSelectedDate({ ...selectedDate, [field]: date.toLocaleDateString() })
    setShowDatePicker({ show: false, field: '' })
  }

  const handleDatePickerOpen = field => {
    setShowDatePicker({ show: true, field })
  }

  const handleDatePickerClose = () => {
    setShowDatePicker({ show: false, field: '' })
  }

  const handleChange = e => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // Merge selected dates into formData
    const completeData = { ...formData, ...selectedDate }

    try {
      // Example POST request using axios to send data to the server
      const response = await axios.post('/api/procurement', completeData)

      if (response.status === 200) {
        setSubmissionStatus({
          type: 'success',
          message: 'Procurement post successfully created!'
        })
        // Optionally, clear the form
        setFormData({
          procurementTitle: '',
          referenceNumber: '',
          introduction: '',
          scopeOfWork: '',
          deliverables: '',
          submissionRequirements: '',
          evaluationCriteria: '',
          termsAndConditions: '',
          contactInformation: ''
        })
        setSelectedDate({
          issuanceDate: '',
          submissionDeadline: '',
          questionsDeadline: '',
          contractAwardDate: ''
        })
      } else {
        setSubmissionStatus({
          type: 'error',
          message: 'Failed to create procurement post. Please try again.'
        })
      }
    } catch (error) {
      setSubmissionStatus({
        type: 'error',
        message: 'An error occurred. Please try again.'
      })
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      {submissionStatus && (
        <Alert
          variant={submissionStatus.type === 'success' ? 'success' : 'danger'}
        >
          {submissionStatus.message}
        </Alert>
      )}
      <Row>
        <Col md={6}>
          <Form.Group controlId='procurementTitle'>
            <Form.Label>Procurement Title</Form.Label>
            <Form.Control
              type='text'
              placeholder='Title: [Service/Product] Procurement for [Specific Purpose/Project]'
              value={formData.procurementTitle}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId='referenceNumber'>
            <Form.Label>Reference Number</Form.Label>
            <Form.Control
              type='text'
              placeholder='Unique Procurement Reference Number'
              value={formData.referenceNumber}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group controlId='introduction'>
        <Form.Label>Introduction</Form.Label>
        <Form.Control
          as='textarea'
          rows={3}
          placeholder='Brief introduction of the company/organization and the purpose of the procurement'
          value={formData.introduction}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId='scopeOfWork'>
        <Form.Label>Scope of Work / Description</Form.Label>
        <Form.Control
          as='textarea'
          rows={4}
          placeholder='Detailed description of the service/product required. Include specifications, quality standards, and any specific features or functionalities.'
          value={formData.scopeOfWork}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId='deliverables'>
        <Form.Label>Deliverables</Form.Label>
        <Form.Control
          as='textarea'
          rows={3}
          placeholder='List expected deliverables, including timelines and milestones.'
          value={formData.deliverables}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId='submissionRequirements'>
        <Form.Label>Submission Requirements</Form.Label>
        <Form.Control
          as='textarea'
          rows={4}
          placeholder='Format for proposals, required documents, technical and financial proposals, etc.'
          value={formData.submissionRequirements}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId='evaluationCriteria'>
        <Form.Label>Evaluation Criteria</Form.Label>
        <Form.Control
          as='textarea'
          rows={3}
          placeholder='Explain how the proposals will be evaluated (price, quality, experience, etc.).'
          value={formData.evaluationCriteria}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group controlId='termsAndConditions'>
        <Form.Label>Terms and Conditions</Form.Label>
        <Form.Control
          as='textarea'
          rows={4}
          placeholder='Summarize key terms of the contract, confidentiality requirements, legal compliance, right to reject, etc.'
          value={formData.termsAndConditions}
          onChange={handleChange}
        />
      </Form.Group>

      <Row>
        <Col md={6}>
          <Form.Group controlId='issuanceDate'>
            <Form.Label>RFP Issuance Date</Form.Label>
            <Form.Control
              type='text'
              placeholder='Select the issuance date'
              value={selectedDate.issuanceDate}
              readOnly
              onClick={() => handleDatePickerOpen('issuanceDate')}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId='submissionDeadline'>
            <Form.Label>Submission Deadline</Form.Label>
            <Form.Control
              type='text'
              placeholder='Select the submission deadline'
              value={selectedDate.submissionDeadline}
              readOnly
              onClick={() => handleDatePickerOpen('submissionDeadline')}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group controlId='questionsDeadline'>
            <Form.Label>Questions and Clarifications Deadline</Form.Label>
            <Form.Control
              type='text'
              placeholder='Select the questions deadline'
              value={selectedDate.questionsDeadline}
              readOnly
              onClick={() => handleDatePickerOpen('questionsDeadline')}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId='contractAwardDate'>
            <Form.Label>Contract Award Date</Form.Label>
            <Form.Control
              type='text'
              placeholder='Select the contract award date'
              value={selectedDate.contractAwardDate}
              readOnly
              onClick={() => handleDatePickerOpen('contractAwardDate')}
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group controlId='contactInformation'>
        <Form.Label>Contact Information</Form.Label>
        <Form.Control
          as='textarea'
          rows={3}
          placeholder='Name, email, phone, and address for contact'
          value={formData.contactInformation}
          onChange={handleChange}
        />
      </Form.Group>

      <Button variant='primary' type='submit'>
        Submit Procurement Post
      </Button>

      <DatePickerModal
        show={showDatePicker.show}
        handleClose={handleDatePickerClose}
        onDateSelect={date => handleDateSelect(date, showDatePicker.field)}
      />
    </Form>
  )
}

export default ProcurementForm
```

### Explanation:

1. **State Management**:

   - `formData` state holds all the form fields' data.
   - `selectedDate` state holds the selected dates for the date-related fields.
   - `submissionStatus` state is used to display success or error messages after form submission.

2. **Handle Form Changes**:

   - `handleChange` updates the `formData` state when the user types into form fields.
   - `handleDateSelect` updates the `selectedDate` state when a date is selected from the `DatePickerModal`.

3. **Handle Form Submission**:
   - The `handleSubmit` function is triggered when the form is submitted. It merges the `

formData`and`selectedDate` into a single object (`completeData`) and sends it to the server using `axios`.

4. **Backend Integration**:

   - The form data is sent to the server-side using a POST request to the `/api/procurement` endpoint. You can adjust this URL to match your actual API endpoint.
   - On successful submission, a success message is displayed, and the form is optionally cleared.
   - If there's an error, an error message is displayed.

5. **Internal Use**:
   - This component is designed to be used within an internal system where the procurement team can post procurement details.

By following this structure, you can integrate this form into your React application, and the data can be saved to your server-side system. Ensure your backend is properly configured to handle the incoming data and perform any necessary validations and storage operations.

# Render A Procurement Post
Certainly! You can create a `ProcurementPost` component that renders the details of a procurement post using the data submitted from the form. This component will accept the procurement data as props and display it in a structured format.

Here’s an example implementation:

```javascript
// src/components/ProcurementPost.js

import React from 'react'
import { Card, ListGroup, Row, Col } from 'react-bootstrap'

const ProcurementPost = ({ data }) => {
  return (
    <Card className='mb-4'>
      <Card.Header as='h3'>{data.procurementTitle}</Card.Header>
      <Card.Body>
        <Row className='mb-3'>
          <Col>
            <strong>Reference Number:</strong> {data.referenceNumber}
          </Col>
          <Col>
            <strong>RFP Issuance Date:</strong> {data.issuanceDate}
          </Col>
        </Row>

        <Card.Title>Introduction</Card.Title>
        <Card.Text>{data.introduction}</Card.Text>

        <Card.Title>Scope of Work / Description</Card.Title>
        <Card.Text>{data.scopeOfWork}</Card.Text>

        {data.deliverables && data.deliverables.length > 0 && (
          <>
            <Card.Title>Deliverables</Card.Title>
            <ListGroup variant='flush'>
              {data.deliverables.map((item, index) => (
                <ListGroup.Item key={index}>{item}</ListGroup.Item>
              ))}
            </ListGroup>
          </>
        )}

        {data.submissionRequirements && data.submissionRequirements.length > 0 && (
          <>
            <Card.Title>Submission Requirements</Card.Title>
            <ListGroup variant='flush'>
              {data.submissionRequirements.map((item, index) => (
                <ListGroup.Item key={index}>{item}</ListGroup.Item>
              ))}
            </ListGroup>
          </>
        )}

        {data.evaluationCriteria && data.evaluationCriteria.length > 0 && (
          <>
            <Card.Title>Evaluation Criteria</Card.Title>
            <ListGroup variant='flush'>
              {data.evaluationCriteria.map((item, index) => (
                <ListGroup.Item key={index}>{item}</ListGroup.Item>
              ))}
            </ListGroup>
          </>
        )}

        {data.termsAndConditions && data.termsAndConditions.length > 0 && (
          <>
            <Card.Title>Terms and Conditions</Card.Title>
            <ListGroup variant='flush'>
              {data.termsAndConditions.map((item, index) => (
                <ListGroup.Item key={index}>{item}</ListGroup.Item>
              ))}
            </ListGroup>
          </>
        )}

        <Row className='mt-4'>
          <Col>
            <strong>Submission Deadline:</strong> {data.submissionDeadline}
          </Col>
          <Col>
            <strong>Questions Deadline:</strong> {data.questionsDeadline}
          </Col>
          <Col>
            <strong>Contract Award Date:</strong> {data.contractAwardDate}
          </Col>
        </Row>

        <Card.Title className='mt-4'>Contact Information</Card.Title>
        <Card.Text>{data.contactInformation}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default ProcurementPost
```

### How It Works:

1. **Props Structure**:

   - The `ProcurementPost` component receives a `data` prop, which is an object containing all the procurement details submitted through the form.

2. **Rendering Different Sections**:

   - Each section of the procurement post (e.g., Introduction, Scope of Work, Deliverables) is rendered conditionally. If the array fields like `deliverables`, `submissionRequirements`, `evaluationCriteria`, or `termsAndConditions` are non-empty, they are displayed using a `ListGroup` component.

3. **Card Layout**:

   - The procurement post is displayed within a Bootstrap `Card` component, with different sections organized under titles. This keeps the information well-structured and easy to read.

4. **Row and Col Layout**:
   - Bootstrap’s grid system (`Row` and `Col`) is used to layout information such as dates and contact details in a responsive manner.

### Example Usage:

You can use this component in a parent component where the procurement post data is available. For example:

```javascript
// src/App.js

import React, { useState } from 'react'
import ProcurementForm from './components/ProcurementForm'
import ProcurementPost from './components/ProcurementPost'

function App() {
  const [procurementData, setProcurementData] = useState(null)

  const handleFormSubmit = data => {
    setProcurementData(data)
  }

  return (
    <div className='container mt-5'>
      {!procurementData && <ProcurementForm onSubmit={handleFormSubmit} />}
      {procurementData && <ProcurementPost data={procurementData} />}
    </div>
  )
}

export default App
```

### Explanation:

1. **Parent Component (`App`)**:

   - The `App` component handles the form submission and stores the submitted data in state (`procurementData`).
   - Initially, it displays the `ProcurementForm` component. Once the form is submitted and data is available, it renders the `ProcurementPost` component with the submitted data.

2. **Form Submission Handling**:
   - The `ProcurementForm` component should be modified to call the `onSubmit` prop with the collected form data when the form is successfully submitted. Here’s a quick way to ensure that:

```javascript
// Inside ProcurementForm component
const handleSubmit = async e => {
  e.preventDefault()

  const completeData = { ...formData, ...selectedDate }

  try {
    const response = await axios.post('/api/procurement', completeData)

    if (response.status === 200) {
      setSubmissionStatus({
        type: 'success',
        message: 'Procurement post successfully created!'
      })
      onSubmit(completeData) // Call the onSubmit prop here
    } else {
      setSubmissionStatus({
        type: 'error',
        message: 'Failed to create procurement post. Please try again.'
      })
    }
  } catch (error) {
    setSubmissionStatus({
      type: 'error',
      message: 'An error occurred. Please try again.'
    })
  }
}
```

This setup will display the procurement post directly on the webpage after submission, using the same data that was entered in the form.


# Display the Reference Number in the URL field
To add the reference number to the URL as a parameter when rendering a procurement post, you can use React Router. This approach will allow you to navigate to a new route that includes the reference number in the URL, and then display the procurement post on that page.

Here's how you can implement this:

### 1. Install React Router

First, if you don't have React Router installed, you need to add it to your project:

```bash
npm install react-router-dom
```

### 2. Update Your App to Use React Router

In your `App.js`, set up React Router to handle different routes:

```javascript
// src/App.js

import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate
} from 'react-router-dom'
import ProcurementForm from './components/ProcurementForm'
import ProcurementPost from './components/ProcurementPost'

function App() {
  return (
    <Router>
      <div className='container mt-5'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route
            path='/procurement/:referenceNumber'
            element={<ProcurementDetails />}
          />
        </Routes>
      </div>
    </Router>
  )
}

function Home() {
  const [procurementData, setProcurementData] = useState(null)
  const navigate = useNavigate()

  const handleFormSubmit = data => {
    setProcurementData(data)
    navigate(`/procurement/${data.referenceNumber}`)
  }

  return (
    <>
      <ProcurementForm onSubmit={handleFormSubmit} />
    </>
  )
}

function ProcurementDetails() {
  // Here, you would retrieve the procurement data, likely from a server using the referenceNumber in the URL.
  // For this example, we'll use a mock procurement data object.
  const [procurementData, setProcurementData] = useState(null)

  // Assuming you're getting the data from a server, you can use useEffect to fetch the data.
  // We'll use the useParams hook to get the referenceNumber from the URL.
  const { referenceNumber } = useParams()

  useEffect(() => {
    // Mock API call to fetch data based on referenceNumber
    const fetchData = async () => {
      // Replace with actual API call
      const response = await fetch(`/api/procurement/${referenceNumber}`)
      const data = await response.json()
      setProcurementData(data)
    }

    fetchData()
  }, [referenceNumber])

  if (!procurementData) {
    return <div>Loading...</div>
  }

  return <ProcurementPost data={procurementData} />
}

export default App
```

### 3. Modify ProcurementForm to Navigate on Submission

In your `ProcurementForm` component, ensure that the `onSubmit` callback is triggered with the form data after successful submission:

```javascript
// src/components/ProcurementForm.js

// ... other imports
import { useNavigate } from 'react-router-dom'

const ProcurementForm = ({ onSubmit }) => {
  // existing state management code...

  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()

    const completeData = { ...formData, ...selectedDate }

    try {
      const response = await axios.post('/api/procurement', completeData)

      if (response.status === 200) {
        setSubmissionStatus({
          type: 'success',
          message: 'Procurement post successfully created!'
        })
        onSubmit(completeData)
        navigate(`/procurement/${completeData.referenceNumber}`)
      } else {
        setSubmissionStatus({
          type: 'error',
          message: 'Failed to create procurement post. Please try again.'
        })
      }
    } catch (error) {
      setSubmissionStatus({
        type: 'error',
        message: 'An error occurred. Please try again.'
      })
    }
  }

  return <Form onSubmit={handleSubmit}>{/* form fields as before... */}</Form>
}
```

### 4. Handle Route with Reference Number

In the `ProcurementDetails` component:

```javascript
// src/components/ProcurementDetails.js

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ProcurementPost from './ProcurementPost'

const ProcurementDetails = () => {
  const { referenceNumber } = useParams()
  const [procurementData, setProcurementData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/procurement/${referenceNumber}`)
        const data = await response.json()
        setProcurementData(data)
      } catch (error) {
        console.error('Error fetching procurement data:', error)
      }
    }

    fetchData()
  }, [referenceNumber])

  if (!procurementData) {
    return <div>Loading...</div>
  }

  return <ProcurementPost data={procurementData} />
}

export default ProcurementDetails
```

### Explanation:

1. **React Router Setup**:

   - The `Router`, `Routes`, and `Route` components from `react-router-dom` are used to define routes in the app.
   - The home route (`"/"`) displays the form, while the route with the reference number parameter (`"/procurement/:referenceNumber"`) displays the procurement details.

2. **Navigation on Form Submission**:

   - When the form is submitted successfully, the app navigates to the procurement details page using `navigate()` from `useNavigate`.

3. **Fetching Procurement Data**:

   - The `ProcurementDetails` component uses `useParams` to get the `referenceNumber` from the URL.
   - It then fetches the procurement data from the server using this `referenceNumber` and displays it using the `ProcurementPost` component.

4. **Displaying Data**:
   - The `ProcurementPost` component is used to render the detailed view of the procurement post, using the data fetched based on the reference number in the URL.

By following this approach, each procurement post is accessible via a unique URL that includes its reference number, making it easy to share and access specific posts.

#Procurement List
To create a component that queries the server for a list of procurement posts, paginates the results, and displays them in a clean, user-friendly format, you can follow these steps:

### 1. Create a Component for Listing Procurement Posts

This component will fetch the procurement posts from the server, handle pagination, and display the results in a formatted list. When a user clicks on a post, they will be redirected to the procurement details page.

Here’s an example implementation:

```javascript
// src/components/ProcurementList.js

import React, { useEffect, useState } from 'react'
import { Card, Button, Pagination } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const ProcurementList = () => {
  const [procurements, setProcurements] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProcurements = async () => {
      try {
        const response = await axios.get(
          `/api/procurements?page=${currentPage}`
        )
        setProcurements(response.data.posts)
        setTotalPages(response.data.totalPages)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching procurement posts:', error)
        setLoading(false)
      }
    }

    fetchProcurements()
  }, [currentPage])

  const handlePageChange = pageNumber => {
    setCurrentPage(pageNumber)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {procurements.map(procurement => (
        <Card key={procurement.referenceNumber} className='mb-4'>
          <Card.Body>
            <Card.Title>{procurement.procurementTitle}</Card.Title>
            <Card.Text>
              {procurement.introduction.substring(0, 100)}...
            </Card.Text>
            <Button
              variant='primary'
              onClick={() =>
                navigate(`/procurement/${procurement.referenceNumber}`)
              }
            >
              View Details
            </Button>
          </Card.Body>
          <Card.Footer className='text-muted'>
            <small>Reference Number: {procurement.referenceNumber}</small>
            <br />
            <small>RFP Issuance Date: {procurement.issuanceDate}</small>
          </Card.Footer>
        </Card>
      ))}

      <Pagination>
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  )
}

export default ProcurementList
```

### 2. Backend API

Ensure that your backend API supports pagination. For example, your endpoint might look something like `/api/procurements?page=1`, and it should return the posts for that page along with the total number of pages.

A typical response might look like this:

```json
{
  "posts": [
    {
      "referenceNumber": "REF123",
      "procurementTitle": "Procurement for Office Supplies",
      "introduction": "We are looking for suppliers to provide office supplies...",
      "issuanceDate": "2024-08-20",
      "submissionDeadline": "2024-09-15"
    }
    // ...more posts
  ],
  "totalPages": 5
}
```

### 3. Adding the Component to Your Application

Integrate the `ProcurementList` component into your application. Here’s how you can include it in your `App.js` file:

```javascript
// src/App.js

import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import ProcurementList from './components/ProcurementList'
import ProcurementDetails from './components/ProcurementDetails'

function App() {
  return (
    <Router>
      <div className='container mt-5'>
        <Routes>
          <Route path='/' element={<ProcurementList />} />
          <Route
            path='/procurement/:referenceNumber'
            element={<ProcurementDetails />}
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
```

### 4. Explanation

- **Fetching Data**:

  - The `ProcurementList` component uses `axios` to fetch data from the backend API. The `useEffect` hook triggers the data fetching when the component is mounted and whenever the `currentPage` changes.

- **Pagination**:

  - The `Pagination` component from `react-bootstrap` is used to display pagination controls. The number of pages is determined by `totalPages`, and clicking a page number updates the `currentPage`, triggering a new data fetch.

- **Displaying the List**:

  - The list of procurements is displayed using Bootstrap `Card` components. Each card shows the title, a truncated introduction (first 100 characters), and other relevant details.
  - A "View Details" button is included, which navigates to the procurement details page when clicked.

- **Navigation**:
  - The `navigate` function from `useNavigate` is used to programmatically navigate to the detailed view of a selected procurement post.

This setup will give you a paginated, searchable list of procurement posts that users can click on to view more detailed information. The UI is clean and easy to navigate, providing a good user experience.


