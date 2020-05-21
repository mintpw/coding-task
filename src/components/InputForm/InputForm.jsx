import React, { useState, useEffect } from 'react';
import { fetchData } from '../../api';
import { Form, Button, Card, ListGroup } from 'react-bootstrap';
// import styles from './InputForm.module.css';
import axios from 'axios';

const InputForm = () => {
  const [textInput, setTextInput] = useState([]);
  const [historyInput, setHistoryInput] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(textInput, 'TEXT IS HERE');
    let eachTextInput = textInput.split('\n');
    // axios
    //   .post(
    //     'https://nlp.insightera.co.th/api/nlp/clustering?token=50513d52c72f169b216a2bbf4755f216',

    //     JSON.stringify({ samples: eachTextInput })
    //   )
    //   .then(function (response) {
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });

    localStorage.setItem('historyInput', eachTextInput);
    console.log(window);
    let data = localStorage.getItem('historyInput');
    setHistoryInput(data);
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>พิมพ์ข้อความภาษาไทยที่นี่</Form.Label>
          <Form.Control
            as='textarea'
            rows='3'
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
        </Form.Group>
        <Button variant='primary' type='submit'>
          Submit
        </Button>
      </Form>
      <Card style={{ width: '18rem' }}>
        <Card.Header>History</Card.Header>
        <ListGroup variant='flush'>
          <ListGroup.Item>{historyInput}</ListGroup.Item>
        </ListGroup>
      </Card>
    </div>
  );
};

export default InputForm;
