import React, {Component} from 'react';
import NavigationBar from './layout/navigationBar.js';
import {api_url} from './env.js';


class App extends Component{

  constructor(props){
    super(props);  
  }

  render() {
    // console.log(apiUrl);

    return (
      <div>
        <NavigationBar styles={this.props.styles} apiUrl={api_url}/>
        
      </div>
    );
  }
}

export default App;