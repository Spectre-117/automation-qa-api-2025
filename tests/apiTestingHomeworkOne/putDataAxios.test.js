import {describe, expect, test} from '@jest/globals';
import axios from 'axios';
import {API_URL} from "../src/constants/api.js";


describe('Test suite for PUT requests by Axios', () => {

    const apiClient = axios.create({
        baseURL: API_URL,
        validateStatus: () => true
    })

    test('Put data with Axios', async () => {

        const requestedID = 1;

        const requestBody = {
            postId: 1,
            name: "new name",
            email: "aaa@gardner.biz",
            body: "New data"
        }

        const response = await apiClient.put(`/comments/${requestedID}`, requestBody);

        expect(response.status).toBe(200);

        expect(response.data).toMatchObject({
            id: requestedID,
            postId: requestBody.postId,
            name: requestBody.name,
            email: requestBody.email,
            body: requestBody.body
        })
    })

})