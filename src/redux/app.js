import React, {Component} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {increment, decrement} from './action/index';

function App(){

    const counter = useSelector(state => state.counter);

    const dispatch = useDispatch();

    return(
        <div>
            counter: {counter}
            <button onClick={() => dispatch(increment(5))}>+</button>
            <button onClick={() => dispatch(decrement(5))}>-</button>
        </div>
    )

}

export default App;