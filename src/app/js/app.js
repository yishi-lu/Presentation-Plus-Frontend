import React, {Component} from 'react';
import NavigationBar from './layout/navigationBar.js';
import apiUrl from './env.js';


class App extends Component{

  constructor(props){
    super(props);  
  }

  render() {
    console.log(apiUrl);

    return (
      <div>
        <NavigationBar styles={this.props.styles} apiUrl={apiUrl}/>
        
      </div>
    );
  }
}

export default App;