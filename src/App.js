import React from 'react';
import { useState, useEffect } from 'react';
import styles from './App.module.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import { InputForm } from './components';

class App extends React.Component {
  setData() {
    let obj = { name: 'Harry', age: 14, email: 'google@gmail.com' };
    localStorage.setItem('myData', JSON.stringify(obj));
  }

  getData() {
    let data = localStorage.getItem('myData');
    data = JSON.parse(data);
    console.log(data.name);
  }
  render() {
    return (
      <div className={styles.container}>
        <InputForm />
        <button onClick={() => this.setData()}>Set Data</button>
        <button onClick={() => this.getData()}>Get Data</button>
      </div>
    );
  }
}

export default App;
