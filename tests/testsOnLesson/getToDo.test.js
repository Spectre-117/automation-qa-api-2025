import {expect, test} from '@jest/globals';
import axios from 'axios';
import {API_URL} from "../../src/constants/api.js";

test.skip("Get toDo request", async () => {

    const todoID = 1;

    const response = await fetch(`${API_URL}/todos/${todoID}`);
    const json = await response.json();
    console.log(json);

    //expect(json.id).toBe(todoID);
    expect(json).toMatchObject({   // can be used to check specified number of fields in the object. Not needed to specify all of them
        userId: todoID,
        id: expect.any(Number),
        //title: expect.any(String),
        //completed: expect.any(Boolean)
    })

    // expect(json).toEqual({    // expected to have the same object structure for expected and actual result, if some field is missed in expected = then it would be error
    //     userId: todoID,
    //     id: expect.any(Number),
    //     title: expect.any(String),
    //     //completed: expect.any(Boolean)   // error will appear because object structure in actual and expected is not equal
    // })
})

test.skip("Get toDo request", async () => {

    const todoID = 1;

    const response = await axios.get(`${API_URL}/todos/${todoID}`);

    expect(response.data).toMatchObject({   // can be used to check specified number of fields in the object. Not needed to specify all of them
        userId: todoID,
        id: expect.any(Number),
        title: expect.any(String),
        completed: expect.any(Boolean)
    })
})