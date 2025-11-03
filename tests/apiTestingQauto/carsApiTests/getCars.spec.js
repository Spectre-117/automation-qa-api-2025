import {describe, expect, beforeEach, test} from '@jest/globals';
import axios from 'axios'
import {wrapper} from 'axios-cookiejar-support';
import {CookieJar} from 'tough-cookie';
import AuthController from "../../../src/controllers/AuthController.js";
import {faker} from '@faker-js/faker';
import CarsController from "../../../src/controllers/CarsController.js";
import {QAUTO_API_URL} from "../../../src/constants/api.js";

describe("get Car from database test suite", () => {
    const jar = new CookieJar();
    const client = wrapper(axios.create({
        baseURL: QAUTO_API_URL,
        validateStatus: () => true,
        jar
    }));

    const authController = new AuthController(client);
    const carsController = new CarsController(client);

    beforeEach(async () => {

        const userPassword = `Psswrds${faker.number.int({min: 1000, max: 1500})}`;
        const userData = {
            "name": faker.person.firstName(),
            "lastName": faker.person.lastName(),
            "email": faker.internet.email(),
            "password": userPassword,
            "repeatPassword": userPassword
        }

        console.log(userData);

        const signUpResponse = await authController.signUp(userData);
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

    test.skip('get Cars of logged in user', async () => {

        //finding brand and then finding it by title
        const carBrandResponse = await carsController.getBrands();
        const brandOne = carBrandResponse.data.data[0];
        const brandTwo = carBrandResponse.data.data[1];

        const carModelResponse = await carsController.getModels();

        const modelOne = carModelResponse.data.data.find(model => model.carBrandId === brandOne.id);
        const modelTwo = carModelResponse.data.data.find(model => model.carBrandId === brandTwo.id);

        const carDataOne = {
            "carBrandId": brandOne.id,
            "carModelId": modelOne.id,
            "mileage": 160000
        }

        const carDataTwo = {
            "carBrandId": brandTwo.id,
            "carModelId": modelTwo.id,
            "mileage": 200000
        }

        const expectedCreatedCarsForUser = [{
            "id": expect.any(Number),
            "carBrandId": brandOne.id,
            "carModelId": modelOne.id,
            "initialMileage": 160000,
            "carCreatedAt": expect.any(String),
            "updatedMileageAt": expect.any(String),   //"2021-05-17T15:26:36.000Z"
            "mileage": 160000,
            "brand": brandOne.title,
            "model": modelOne.title,
            "logo": brandOne.logoFilename
        },
            {
                "id": expect.any(Number),
                "carBrandId": brandTwo.id,
                "carModelId": modelTwo.id,
                "initialMileage": 200000,
                "carCreatedAt": expect.any(String),
                "updatedMileageAt": expect.any(String),   //"2021-05-17T15:26:36.000Z"
                "mileage": 200000,
                "brand": brandTwo.title,
                "model": modelTwo.title,
                "logo": brandTwo.logoFilename
            },
        ]


        const carOneCreateResponse = await carsController.postNewCar(carDataOne);
        expect(carOneCreateResponse.status).toBe(201);

        const carTwoCreateResponse = await carsController.postNewCar(carDataTwo);
        expect(carTwoCreateResponse.status).toBe(201);

        const getCreatedCars = await carsController.getCars();
        expect(getCreatedCars.status).toBe(200);
        expect(getCreatedCars.data.status).toBe("ok");

        expect(getCreatedCars.data.data).toMatchObject(expectedCreatedCarsForUser);
    });

    test.skip('get cars of Not logged In user', async () => {

        //finding brand and then finding it by title
        const carBrandResponse = await carsController.getBrands();
        const brand = carBrandResponse.data.data[0];

        const carModelResponse = await carsController.getModels();
        const model = carModelResponse.data.data.find(model => model.carBrandId === brand.id);

        const carData = {
            "carBrandId": brand.id,
            "carModelId": model.id,
            "mileage": 160000
        }

        const carCreateResponse = await carsController.postNewCar(carData);
        expect(carCreateResponse.status).toBe(201)
        const createdCarID = carCreateResponse.data.data.id;
        console.log(createdCarID);

        const signOutResponse = await authController.logOut();
        expect(signOutResponse.status).toBe(200)


        const getCreatedCars = await carsController.getCars();
        expect(getCreatedCars.status).toBe(401);
        console.log(getCreatedCars.data);
        expect(getCreatedCars.data).toEqual({
                "status": "error",
                "message": "Not authenticated"
            }
        );
    });

    test.skip('get existing Car by unexpected endpoint', async () => {

        const carBrandResponse = await carsController.getBrands();
        const brand = carBrandResponse.data.data[0];

        const carModelResponse = await carsController.getModels();
        const model = carModelResponse.data.data.find(model => model.carBrandId === brand.id);

        const carData = {
            "carBrandId": brand.id,
            "carModelId": model.id,
            "mileage": 160000
        }

        const carCreateResponse = await carsController.postNewCar(carData);
        expect(carCreateResponse.status).toBe(201);

        const getCreatedCars = await carsController.getCars('/api/cardess');
        expect(getCreatedCars.status).toBe(404);
        expect(getCreatedCars.data).toEqual({
                "status": "error",
                "message": "Not found"
            }
        );
    });

});