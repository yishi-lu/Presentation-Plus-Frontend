export const increment = (num=1) => {
    return {
        type: "increment",
        playload: num,
    }
}

export const decrement = (num=1) => {
    return {
        type: "decrement",
        playload: num,
    }
}