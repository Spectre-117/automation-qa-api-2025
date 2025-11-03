import {describe, expect, beforeEach, test} from '@jest/globals';
import axios from 'axios'
import {wrapper} from 'axios-cookiejar-support';
import {CookieJar} from 'tough-cookie';
import AuthController from "../../../src/controllers/AuthController.js";
import {faker} from '@faker-js/faker';
import CarsController from "../../../src/controllers/CarsController.js";
import {QAUTO_API_URL} from "../../../src/constants/api.js";

describe("post new Car for user test suite", () => {
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

    test.skip('add New car to user', async () => {

        //finding brand and then finding it by title
        const carBrandResponse = await carsController.getBrands();
        const brand = carBrandResponse.data.data[0];

        const carModelResponse = await carsController.getModels();
        const model = carModelResponse.data.data.find(model => model.carBrandId ===brand.id);

        const carData ={
            "carBrandId": brand.id,
            "carModelId": model.id,
            "mileage": 160000
        }

        const expectedCreatedCar = {
            "id": expect.any(Number),
            "carBrandId": brand.id,
            "carModelId": model.id,
            "initialMileage": 160000,
            "carCreatedAt": expect.any(String),
            "updatedMileageAt": expect.any(String),   //"2021-05-17T15:26:36.000Z"
            "mileage": 160000,
            "brand": brand.title,
            "model": model.title,
            "logo": brand.logoFilename
        }

        const carCreateResponse = await carsController.postNewCar(carData);
        expect(carCreateResponse.status).toBe(201);
        expect(carCreateResponse.data.status).toBe("ok");
        expect(carCreateResponse.data.data).toEqual(expectedCreatedCar);

        const createdCarID = carCreateResponse.data.data.id;

        const getCreatedCarByID = await carsController.getCarById(createdCarID);
        expect(getCreatedCarByID.status).toBe(200);
        expect(getCreatedCarByID.data.status).toBe("ok");
        expect(getCreatedCarByID.data.data).toMatchObject(expectedCreatedCar);
    });

    test.skip('add New car to user without Brand ID', async () => {

        //finding brand and then finding it by title
        const carBrandResponse = await carsController.getBrands();
        const brand = carBrandResponse.data.data[0];

        const carModelResponse = await carsController.getModels();
        const model = carModelResponse.data.data.find(model => model.carBrandId === brand.id);

        const carData = {
            "carModelId": model.id,
            "mileage": 160000
        }

        const expectedCreatedCar = {
            status: 'error',
            message: 'Car brand id is required'}

        const carCreateResponse = await carsController.postNewCar(carData);
        expect(carCreateResponse.status).toBe(400);
        expect(carCreateResponse.data).toEqual(expectedCreatedCar);

    })

    test.skip('add New car to user without Model ID', async () => {

        //finding brand and then finding it by title
        const carBrandResponse = await carsController.getBrands();
        const brand = carBrandResponse.data.data[0];

        const carModelResponse = await carsController.getModels();
        const model = carModelResponse.data.data.find(model => model.carBrandId === brand.id);

        const carData = {
            "carBrandId": brand.id,
            "mileage": 160000
        }

        const expectedCreatedCar = {
            status: 'error',
            message: 'Car model id is required'}

        const carCreateResponse = await carsController.postNewCar(carData);
        expect(carCreateResponse.status).toBe(400);
        expect(carCreateResponse.data).toEqual(expectedCreatedCar);

    })

    test.skip('add New car to user without Mileage ', async () => {

        //finding brand and then finding it by title
        const carBrandResponse = await carsController.getBrands();
        const brand = carBrandResponse.data.data[0];

        const carModelResponse = await carsController.getModels();
        const model = carModelResponse.data.data.find(model => model.carBrandId === brand.id);

        const carData = {
            "carBrandId": brand.id,
            "carModelId": model.id,
        }

        const expectedCreatedCar = {
            status: 'error',
            message: 'Mileage is required'}

        const carCreateResponse = await carsController.postNewCar(carData);
        expect(carCreateResponse.status).toBe(400);
        expect(carCreateResponse.data).toEqual(expectedCreatedCar);

    })

    test.skip('add New car to wrong endpoint', async () => {

        //finding brand and then finding it by title
        const carBrandResponse = await carsController.getBrands();
        const brand = carBrandResponse.data.data[0];

        const carModelResponse = await carsController.getModels();
        const model = carModelResponse.data.data.find(model => model.carBrandId ===brand.id);

        const carData ={
            "carBrandId": brand.id,
            "carModelId": model.id,
            "mileage": 160000
        }

        const expectedResponse = {
            "status": "error",
            "message": "Not found"
        }

        const carCreateResponse = await carsController.postNewCar(carData,'/api/car');
        expect(carCreateResponse.status).toBe(404);
        expect(carCreateResponse.data).toEqual(expectedResponse);
    });

    test.skip('add New car with wrong CarData parameter type', async () => {

        //finding brand and then finding it by title
        const carBrandResponse = await carsController.getBrands();
        const brand = carBrandResponse.data.data[0];

        const carModelResponse = await carsController.getModels();
        const model = carModelResponse.data.data.find(model => model.carBrandId ===brand.id);

        const carData ={
            "carBrandId": "brand.id",
            "carModelId": model.id,
            "mileage": 160000
        }

        const expectedResponse = {
            "status": "error",
            "message": "Not found"
        }

        const carCreateResponse = await carsController.postNewCar(carData,'/api/car');
        expect(carCreateResponse.status).toBe(404);
        expect(carCreateResponse.data).toEqual(expectedResponse);
    });

    test.skip('add New car to user which is NOT logged in', async () => {

        const signOutResponse = await authController.logOut();
        expect(signOutResponse.status).toBe(200)

        //finding brand and then finding it by title
        const carBrandResponse = await carsController.getBrands();
        const brand = carBrandResponse.data.data[0];

        const carModelResponse = await carsController.getModels();
        const model = carModelResponse.data.data.find(model => model.carBrandId ===brand.id);

        const carData ={
            "carBrandId": brand.id,
            "carModelId": model.id,
            "mileage": 160000
        }

        const carCreateResponse = await carsController.postNewCar(carData);
        expect(carCreateResponse.status).toBe(401);
        expect(carCreateResponse.data).toEqual({
                "status": "error",
                "message": "Not authenticated"
            }
        );
    });

});