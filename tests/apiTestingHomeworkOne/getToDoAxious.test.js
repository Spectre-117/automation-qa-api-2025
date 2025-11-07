import {describe, expect, test} from '@jest/globals';
import axios from 'axios';
import {API_URL} from "../../src/constants/api.js";


describe('Test suite for GET toDo by toDo id request by Axios', () => {

    const apiClient = axios.create({
        baseURL: API_URL,
        validateStatus: () => true
    })

    test.skip('Get toDo with Axios', async () => {

        const toDoID = 1;

        const response = await apiClient.get(`/todos/${toDoID}`);

        expect(response.status).toBe(200);

        expect(response.data).toMatchObject({
            userId: toDoID,
            id: expect.any(Number),
            title: expect.any(String),
            completed: expect.any(Boolean)
        })
    })

})