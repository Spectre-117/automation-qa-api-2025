import {expect, describe, test} from '@jest/globals';
import axios from 'axios';
import {API_URL} from "../../src/constants/api.js";

describe("Test suite for POST requests by Axios", () => {

    const apiClient = axios.create({
        baseURL: API_URL,
        validateStatus: () => true
    });

    test.skip('createPostAxios', async () => {

        const requestBody = {
            title: 'foo',
            body: 'bar',
            userId: 1
        }

        //const response = await axios.post('https://jsonplaceholder.typicode.com/posts', requestBody);    -  if not create apiClient (const apiClient = axios.create({baseURL: API_URL}))
        const response = await apiClient.post("/posts", requestBody);

        expect(response.status).toBe(201);

        expect(response.data).toEqual({
            id: expect.any(Number),
            title: requestBody.title,
            body: requestBody.body,
            userId: requestBody.userId
        })
    })

    test.skip('createPost with only title with Axios', async () => {

        const requestBody = {
            title: 'Custom title'
        }
        const response = await apiClient.post('/posts', requestBody);

        expect(response.status).toBe(201);

        expect(response.data).toMatchObject({
            id: expect.any(Number),
            title: requestBody.title
        })
    })
});