import {describe, expect, beforeEach, test} from '@jest/globals';
import axios from 'axios'
import {wrapper} from 'axios-cookiejar-support';
import {CookieJar} from 'tough-cookie';
import AuthController from "../../../src/controllers/AuthController.js";
import {faker} from '@faker-js/faker';
import CarsController from "../../../src/controllers/CarsController.js";
import {QAUTO_API_URL} from "../../../src/constants/api.js";
import {expectedCarModelsList} from "../../fixtures/apiCarFixtures.js";


describe("get Car brands test suite", () => {
    const jar = new CookieJar();
    const client = wrapper(axios.create({
        baseURL: QAUTO_API_URL,
        validateStatus: () => true,
        jar
    }));

    const authController = new AuthController(client);
    const carsController = new CarsController(client);

    const expectedCarModel =
        {
            "id": 1,
            "carBrandId": 1,
            "title": "TT"
        }


    beforeEach(async () => {

        const userPassword = `Psswrds${faker.number.int({min: 1000, max: 1500})}`;
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
                "remember": false
            }
        )
        expect(signInResponse.status).toBe(200)
    })

    test.skip('get car Models', async () => {
        const carModelsResponse = await carsController.getModels();
        expect(carModelsResponse.status).toBe(200);
        expect(carModelsResponse.data.status).toBe("ok");
        expect(carModelsResponse.data.data).toMatchObject(expectedCarModelsList);
    });


    test.skip('get car models by brand ID', async () => {

        const carBrandsResponse = await carsController.getBrands();
        expect(carBrandsResponse.status).toBe(200)
        const foundBrandID = carBrandsResponse.data.data[0].id;

        const carModelsResponse = await carsController.getModels();
        expect(carModelsResponse.status).toBe(200);
        expect(carModelsResponse.data.status).toBe("ok");

        // array of car models by brand ID
        const receivedModelsOfBrand = carModelsResponse.data.data.filter((car)=>car.carBrandId===foundBrandID)
        // array of car models by brand ID in existing list
        const existingModelsOfBrand = expectedCarModelsList.filter((car)=>car.carBrandId===foundBrandID)

        console.log(receivedModelsOfBrand);
        console.log("------------------");
        console.log(existingModelsOfBrand);


        expect(receivedModelsOfBrand).toEqual(existingModelsOfBrand);
    });

    test.skip('get car model structure', async () => {
        const carModelsResponse = await carsController.getModels();
        expect(carModelsResponse.status).toBe(200);
        expect(carModelsResponse.data.status).toBe("ok");
        for (const carModel of carModelsResponse.data.data) {
            expect(carModel).toMatchObject({
                id: expect.any(Number),
                carBrandId: expect.any(Number),
                title: expect.any(String),
            })
        }
    });

    test.skip('get car models with wrong endpoint', async () => {
        const carBrandsWrongEndpointResponse = await carsController.getModels('/api/cars/brgfands');
        expect(carBrandsWrongEndpointResponse.status).toBe(404);
        expect(carBrandsWrongEndpointResponse.data).toEqual(
            {
                "status": "error",
                "message": "Car not found"
            }
        );
    });
});