import {expect, describe, test} from '@jest/globals';
import axios from 'axios';

describe("Test suite for POST requests", () => {

    test.skip('createPost', async () => {

        const requestBody = {
            title: 'foo',
            body: 'bar',
            userId: 1
        }
        const request = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        const post = await request.json();
        console.log(post);

        expect(post).toEqual({
            id: expect.any(Number),
            title: requestBody.title,
            body: requestBody.body,
            userId: requestBody.userId
        })
    })

    test.skip('createPost with only title', async () => {

        const requestBody = {
            title: 'Custom title'
        }
        const request = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });

        const post = await request.json();
        console.log(post);

        expect(post).toMatchObject({
            id: expect.any(Number),
            title: requestBody.title
        })
    })
});