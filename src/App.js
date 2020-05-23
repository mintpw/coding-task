import React from 'react';
import styles from './App.module.css';
import 'bootstrap/dist/css/bootstrap.css';
import { InputForm } from './components';

class App extends React.Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Clustering API</h2>
        </div>
        <InputForm />
        <div className={styles.footer}></div>
      </div>
    );
  }
}

export default App;
