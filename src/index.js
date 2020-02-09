import React from 'react';
import {render} from 'react-dom';

import App from './app/js/app.js';

import styles from './app/css/main.module.css';

render(<App styles={styles}/>, document.getElementById('root'));


//================================================================================


// import React from 'react';
// import {render} from 'react-dom';
// import App from './redux/app';
// import allReducers from './redux/reducer/index';

// import { createStore } from 'redux';
// import {Provider} from 'react-redux';


// const myStore = createStore(allReducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());


// render(
//     <Provider store={myStore}>
//         <App />
//     </Provider>, 
//     document.getElementById('root')
// );

//================================================================================

// import {ThemeContext, themes} from './theme-context';
// import ThemedButton from './themed-button';

// // An intermediate component that uses the ThemedButton
// function Toolbar(props) {
//   return (
//     <ThemedButton onClick={props.changeTheme}>
//       Change Theme
//     </ThemedButton>
//   );
// }

// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       theme: themes.light,
//     };

//     this.toggleTheme = () => {
//       this.setState(state => ({
//         theme:
//           state.theme === themes.dark
//             ? themes.light
//             : themes.dark,
//       }));
//     };
//   }

//   render() {
//     // The ThemedButton button inside the ThemeProvider
//     // uses the theme from state while the one outside uses
//     // the default dark theme
//     return (
//       <div>
//         <ThemeContext.Provider value={this.state.theme}>
//           <Toolbar changeTheme={this.toggleTheme} />
//         </ThemeContext.Provider>
//         <div>
//           <ThemedButton />
//         </div>
//       </div>
//     );
//   }
// }


// render(<App />, document.getElementById('root'));