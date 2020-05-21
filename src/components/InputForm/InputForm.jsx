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
    // let splitLine = textInput.split('\n');
    // axios
    //   .post(
    //     'https://nlp.insightera.co.th/api/nlp/clustering?token=50513d52c72f169b216a2bbf4755f216',

    //     JSON.stringify({ samples: splitLine })
    //   )
    //   .then(function (response) {
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
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
            id='textarea'
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
          <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
          <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
        </ListGroup>
      </Card>
    </div>
  );
};

export default InputForm;
