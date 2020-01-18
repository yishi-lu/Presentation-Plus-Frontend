const counterReducer = (state=0, action) => {

    switch(action.type){
        case "increment":
            return state + action.playload;
        case "decrement":
            return state - action.playload;
        default:
            return state;
    }

}

export default counterReducer;