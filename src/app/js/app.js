import React, {Component} from 'react';
import NavigationBar from './layout/navigationBar.js';

import styles from '../css/main.css';

class App extends Component{

  constructor(props){
    super(props);  
  }

  render() {
    return (
      <div>
        <NavigationBar styles={styles}/>
        
      </div>
    );
  }
}

export default App;