import {describe, expect, test} from '@jest/globals';
import axios from 'axios';
import {API_URL} from "../../src/constants/api.js";


describe('Test suite for GET post By ID request by Axios', () => {

    const apiClient = axios.create({
        baseURL: API_URL,
        validateStatus: () => true
    })

    test.skip('Get toDo with Axios', async () => {

        const postID = 4;

        const response = await apiClient.get(`/posts/${postID}`);

        expect(response.status).toBe(200);

        expect(response.data).toMatchObject({
            userId: expect.any(Number),
            id: postID,
            title: expect.any(String),
            body: expect.any(String)
        })
    })

})