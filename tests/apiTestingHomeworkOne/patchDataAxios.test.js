import {describe, expect, test} from '@jest/globals';
import axios from 'axios';
import {API_URL} from "../src/constants/api.js";


describe('Test suite for Patch requests by Axios', () => {

    const apiClient = axios.create({
        baseURL: API_URL,
        validateStatus: () => true
    })

    test('Patch data with Axios', async () => {

        const requestedID = 4;

        const requestBody = {
            name: "NEW COMMENT NAME",
        }

        const response = await apiClient.put(`/comments/${requestedID}`, requestBody);

        expect(response.status).toBe(200);

        expect(response.data).toMatchObject({
            id: requestedID,
            name: requestBody.name
        })
    })

})