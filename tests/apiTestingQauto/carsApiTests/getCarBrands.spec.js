import {describe, expect, beforeEach, test} from '@jest/globals';
import axios from 'axios'
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import AuthController from "../../../src/controllers/AuthController.js";
import { faker } from '@faker-js/faker';
import CarsController from "../../../src/controllers/CarsController.js";
import {QAUTO_API_URL} from "../../../src/constants/api.js";
import {expectedCarBrandList} from "../../fixtures/apiCarFixtures.js";



describe("get Car brands test suite with controllers", () => {
    const jar = new CookieJar();
    const client = wrapper(axios.create({
        baseURL: QAUTO_API_URL,
        validateStatus: () => true,
        jar
    }));

    const authController = new AuthController(client);
    const carsController = new CarsController(client);

    beforeEach (async () => {

        const userPassword = `Psswrds${faker.number.int({min:1000, max:1500})}`;
        const userData = {
            "name": faker.person.firstName(),
            "lastName": faker.person.lastName(),
            "email": faker.internet.email(),
            "password": userPassword,
            "repeatPassword": userPassword
        }

        const signUpResponse = await authController.signUp(userData);
        console.log(signUpResponse.data);
        expect(signUpResponse.status).toBe(201);

        const signInResponse = await authController.signIn(
            {
                "email": userData.email,
                "password": userData.password,
                "remember" : false
            }
        )
        expect(signInResponse.status).toBe(200)
    })

    test.skip('gets car brands', async () => {

        const carBrandsResponse = await carsController.getBrands();
        expect(carBrandsResponse.status).toBe(200);
        expect(carBrandsResponse.data.status).toBe("ok");
        expect(carBrandsResponse.data.data).toMatchObject(expectedCarBrandList);
    });

    test.skip('gets car brands with wrong endpoint', async () => {
        const carBrandsWrongEndpointResponse = await carsController.getBrands('/api/carfds/brands');
        expect(carBrandsWrongEndpointResponse.status).toBe(404);
        expect(carBrandsWrongEndpointResponse.data).toEqual(
            {
                "status": "error",
                "message": "Not found"
            }
        );
    });

    test.skip('get car brand structure', async () => {
        const carBrandsResponse = await carsController.getBrands();
        expect(carBrandsResponse.status).toBe(200);
        expect(carBrandsResponse.data.status).toBe("ok");
        for (const carBrand of carBrandsResponse.data.data) {
            expect(carBrand).toMatchObject({
                id: expect.any(Number),
                logoFilename: expect.any(String),
                title: expect.any(String),
            })
        }
    });
});