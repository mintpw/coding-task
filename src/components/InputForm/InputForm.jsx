import React, { useState, useEffect } from 'react';
import { fetchData } from '../../api';
import { Pie, Bar } from 'react-chartjs-2';
import { Form, Button, Card, ListGroup } from 'react-bootstrap';
import { writeStorage, useLocalStorage } from '@rehooks/local-storage';
// import styles from './InputForm.module.css';
import axios from 'axios';

const InputForm = () => {
  const [textInput, setTextInput] = useState([]);
  const [saveInput, setSaveInput] = useState([]);
  const [group, setGroup] = useState(['sss']);
  const [result, setResult] = useState([]);
  const [pieData, setPieData] = useState({
    labels: [],
    datasets: [],
  });

  // const [textValue] = useLocalStorage('key');
  useEffect(() => {
    if (result.length > 0) {
      let dataArray = zipChart(result);
      setPieData({
        labels: ['Group1', 'Group2', 'Group3'],
        datasets: [
          {
            data: dataArray,
            fill: true,
            backgroundColor: ['red', 'green', 'blue'],
          },
        ],
      });
    }
  }, [result]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(textInput, 'TEXT IS HERE');
    let eachTextInput = textInput.split('\n');
    setSaveInput(eachTextInput);
    axios
      .post(
        'https://nlp.insightera.co.th/api/nlp/clustering?token=50513d52c72f169b216a2bbf4755f216',

        JSON.stringify({
          // k: 1,
          max_k: 3,
          samples: eachTextInput,
        })
      )
      .then(function (response) {
        console.log(response);
        console.log(response?.data?.result?.message?.cluster);
        console.log(response.config.data);
        setResult(response?.data?.result?.message?.cluster);
      })
      .catch(function (error) {
        console.log(error);
      });

    // writeStorage('key', eachTextInput);

    // localStorage.setItem('historyInput', eachTextInput);
    // console.log(window);
    // let data = localStorage.getItem('historyInput');
    // setHistoryInput(data);
  };

  let zip = (saveInput, result) =>
    saveInput.map((item, i) => [item, result[i]]);
  console.log(zip(saveInput, result), 'ZIP');

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
    //return map;
    let someArray = [];
    map.forEach((value) => {
      someArray.push(value);
    });
    // result.forEach((element) => {
    //   console.log('result', result);
    //   console.log('someArray[element]', someArray[element]);
    //   someArray[element]++;
    // });
    console.log('someArray', someArray);
    return someArray;
  };

  var pieChart = result ? (
    <Pie
      data={pieData}
      // {{
      //   labels: ['Group1', 'Group2', 'Group3'],
      //   datasets: [
      //     {
      //       data: [],
      //       fill: true,
      //       backgroundColor: ['red', 'green', 'blue'],
      //     },
      //   ],
      // }}
      options={{
        title: {
          display: true,
          text: 'ผลการวิเคราะห์',
          position: 'top',
          fontColor: '#FFBC00',
        },
        // events: ['click'],
        rotation: -0.7 * Math.PI,
        onClick: function (e, activeElement) {
          // activeElement[0].index;
          console.log(activeElement, 'OnClickActive OUTSIDE');
          if (activeElement) {
            if (activeElement.length > 0) {
              //console.log(activeElement[0]._index);
              console.log(e, 'OnClickE');
              console.log(activeElement, 'OnClickActive');
              setGroup(() => {
                let groupArray = zip(saveInput, result);
                let paragraph = [];
                paragraph.push(<h4>Group {activeElement[0]._index + 1}</h4>);
                for (let index = 0; index < groupArray.length; index++) {
                  const element = groupArray[index];

                  if (element[1] === activeElement[0]._index) {
                    paragraph.push(<div>{element[0]}</div>);
                  }
                  console.log(element, 'ELEMENT');
                }
                console.log(paragraph, 'paragraph');
                return paragraph;
              });
            }
          }
        },
      }}
    />
  ) : null;

  // const BreakLine = ({ group }) => <li>{group}</li>;

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>พิมพ์ข้อความภาษาไทยที่นี่</Form.Label>
          <Form.Control
            as='textarea'
            rows='10'
            id='textarea'
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
        </Form.Group>
        <Button variant='primary' type='submit'>
          Submit
        </Button>
        {pieChart}
        <Card>
          <Card.Body>
            <h2>RESULT</h2>
            {group}
          </Card.Body>
        </Card>
      </Form>
    </div>
  );
};

export default InputForm;
