import React, { useState, useEffect } from 'react';
import { Pie } from 'react-chartjs-2';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import styles from './InputForm.module.css';
import axios from 'axios';

const InputForm = () => {
  const [textInput, setTextInput] = useState([]);
  const [saveInput, setSaveInput] = useState([]);
  const [group, setGroup] = useState([]);
  const [result, setResult] = useState([]);
  const [alertIsEnabled, setAlertIsEnabled] = useState(false);
  const [pieData, setPieData] = useState({ labels: [], datasets: [] });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  useEffect(() => {
    if (result.length > 0) {
      let dataArray = zipChart(result);
      setPieData({
        labels: ['Group 1', 'Group 2', 'Group 3'],
        datasets: [
          {
            data: dataArray,
            fill: true,
            backgroundColor: ['#303960', '#ea9a96', '#f8b24f'],
          },
        ],
      });
    }
  }, [result]);

  useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAlertIsEnabled(false);

    if (!token) {
      return;
    }

    if (textInput.length <= 0) {
      return;
    }

    let eachTextInput = textInput.split('\n');
    setSaveInput(eachTextInput);
    axios
      .post(
        'https://nlp.insightera.co.th/api/nlp/clustering?token=' + token,
        JSON.stringify({
          max_k: 3,
          samples: eachTextInput,
        }),
        { timeout: 4000 }
      )
      .then(function (response) {
        setResult(response?.data?.result?.message?.cluster);
        if (response?.data?.result.result.toUpperCase() === 'ERROR') {
          setAlertIsEnabled(true);
        }
      })
      .catch(function (error) {
        console.log(error);
        setAlertIsEnabled(true);
      });
  };

  let zip = (saveInput, result) =>
    saveInput.map((item, i) => [item, result[i]]);

  let zipChart = (result) => {
    const map = new Map();
    result.forEach((item) => {
      const groupId = item;
      const numberOfItems = map.get(groupId);
      if (!numberOfItems) {
        map.set(groupId, 1);
      } else {
        map.set(groupId, map.get(groupId) + 1);
      }
    });

    let sortDataArray = [];
    for (let index = 0; index < map.size; index++) {
      sortDataArray.push(map.get(index));
    }
    return sortDataArray;
  };

  var pieChart = (
    <Pie
      data={pieData}
      options={{
        title: {
          display: true,
          text: 'Analysis Results',
          position: 'top',
          fontColor: '#303960',
        },
        rotation: -0.7 * Math.PI,
        onClick: function (e, activeElement) {
          if (activeElement) {
            if (activeElement.length > 0) {
              setGroup(() => {
                const listElement = [];
                const groupArray = zip(saveInput, result);

                for (let index = 0; index < groupArray.length; index++) {
                  const element = groupArray[index];
                  if (element[1] === activeElement[0]._index) {
                    listElement.push(<li>{element[0]}</li>);
                  }
                }

                const numberOfMessage =
                  listElement.length > 1 ? 'Messages' : 'Message';
                return (
                  <>
                    <h4>
                      Group {activeElement[0]._index + 1} ({listElement.length}{' '}
                      {numberOfMessage})
                    </h4>
                    <ol>{listElement}</ol>
                  </>
                );
              });
            }
          }
        },
      }}
    />
  );

  return (
    <div className={styles.container}>
      <div className={styles.containerContent}>
        <Alert
          show={alertIsEnabled}
          variant='danger'
          onClose={() => setAlertIsEnabled(false)}
          dismissible>
          <Alert.Heading>SORRY</Alert.Heading>
          <p>Something went wrong! Please try again later!</p>
        </Alert>

        <Card className={styles.cardStyle}>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>
                Token <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                as='input'
                rows='10'
                id='tokenInput'
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />

              <Form.Label>
                Input Message Here <span style={{ color: 'red' }}>*</span>
              </Form.Label>
              <Form.Control
                as='textarea'
                rows='10'
                id='textarea'
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
            </Form.Group>
            <Button
              className={styles.button}
              type='submit'
              disabled={!token || textInput.length <= 0}>
              Submit
            </Button>
          </Form>
        </Card>

        <div className={styles.containerPie}>{pieChart}</div>
        <Card className={styles.cardResult}>
          <Card.Body>
            <h2>Analysis Results</h2>
            {group}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default InputForm;
