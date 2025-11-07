import {describe, expect, beforeEach, test} from '@jest/globals';
import axios from 'axios'
import {wrapper} from 'axios-cookiejar-support';
import {CookieJar} from 'tough-cookie';
import AuthController from "../../../src/controllers/AuthController.js";
import {faker} from '@faker-js/faker';
import CarsController from "../../../src/controllers/CarsController.js";
import {QAUTO_API_URL} from "../../../src/constants/api.js";
import {initialMileageOne} from "../../fixtures/apiCarFixtures.js";

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

    test.skip('get existing Car by ID', async () => {

        //finding brand and then finding it by title
        const carBrandResponse = await carsController.getBrands();
        const brand = carBrandResponse.data.data[0];

        const carModelResponse = await carsController.getModels();
        const model = carModelResponse.data.data.find(model => model.carBrandId === brand.id);

        const carData = {
            "carBrandId": brand.id,
            "carModelId": model.id,
            "mileage": initialMileageOne
        }

        const expectedCreatedCar = {
            "id": expect.any(Number),
            "carBrandId": carData.carBrandId,
            "carModelId": carData.carModelId,
            "initialMileage": carData.mileage,
            "carCreatedAt": expect.any(String),
            "updatedMileageAt": expect.any(String),   //"2021-05-17T15:26:36.000Z"
            "mileage": carData.mileage,
            "brand": brand.title,
            "model": model.title,
            "logo": brand.logoFilename
        }

        const carCreateResponse = await carsController.postNewCar(carData);
        expect(carCreateResponse.status).toBe(201);

        const createdCarID = carCreateResponse.data.data.id;

        const getCreatedCarByID = await carsController.getCarById(createdCarID);
        expect(getCreatedCarByID.status).toBe(200);
        expect(getCreatedCarByID.data.status).toBe("ok");
        expect(getCreatedCarByID.data.data).toMatchObject(expectedCreatedCar);
    });

    test.skip('get a car from database when user is NOT logged in', async () => {

        //finding brand and then finding it by title
        const carBrandResponse = await carsController.getBrands();
        const brand = carBrandResponse.data.data[0];

        const carModelResponse = await carsController.getModels();
        const model = carModelResponse.data.data.find(model => model.carBrandId === brand.id);

        const carData = {
            "carBrandId": brand.id,
            "carModelId": model.id,
            "mileage": initialMileageOne
        }

        const carCreateResponse = await carsController.postNewCar(carData);
        expect(carCreateResponse.status).toBe(201)
        const createdCarID = carCreateResponse.data.data.id;
        console.log(createdCarID);

        const signOutResponse = await authController.logOut();
        expect(signOutResponse.status).toBe(200)


        const getCreatedCarByID = await carsController.getCarById(createdCarID);
        expect(getCreatedCarByID.status).toBe(401);
        console.log(getCreatedCarByID.data);
        expect(getCreatedCarByID.data).toEqual({
                "status": "error",
                "message": "Not authenticated"
            }
        );
    });

    test.skip('get existing Car by unexpected ID', async () => {
        //finding brand and then finding it by title
        const carBrandResponse = await carsController.getBrands();
        const brand = carBrandResponse.data.data[0];

        const carModelResponse = await carsController.getModels();
        const model = carModelResponse.data.data.find(model => model.carBrandId === brand.id);

        const carData = {
            "carBrandId": brand.id,
            "carModelId": model.id,
            "mileage": initialMileageOne
        }

        const carCreateResponse = await carsController.postNewCar(carData);
        expect(carCreateResponse.status).toBe(201);

        const createdCarID = "unexpected value";

        const getCreatedCarByID = await carsController.getCarById(createdCarID);
        expect(getCreatedCarByID.status).toBe(404);
        expect(getCreatedCarByID.data).toEqual({
                "status": "error",
                "message": "Car not found"
            }
        );
    });

});