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

        const carBrandResponse = await carsController.getBrands();
        const brandOne = carBrandResponse.data.data[0];

        const carModelResponse = await carsController.getModels();
        const modelOne = carModelResponse.data.data.find(model => model.carBrandId === brandOne.id);

        const carDataOne = {
            "carBrandId": brandOne.id,
            "carModelId": modelOne.id,
            "mileage": 160000
        }

        const carOneCreateResponse = await carsController.postNewCar(carDataOne);
        expect(carOneCreateResponse.status).toBe(201);
    })

    test.skip('delete user\'s car', async () => {

        const getCreatedCars = await carsController.getCars();
        expect(getCreatedCars.status).toBe(200);
        console.log(getCreatedCars.data);
        console.log("--------------")

        const userCarID = getCreatedCars.data.data[0].id;

        const carOneDeletedResponse = await carsController.deleteCar(userCarID);
        expect(carOneDeletedResponse.status).toBe(200);
        expect(carOneDeletedResponse.data.data).toEqual({
            "carId": userCarID
        });
        console.log(carOneDeletedResponse.data.data);

        console.log("--------------")

        // check if car was changed
        const getCreatedCarByID = await carsController.getCarById(userCarID);
        expect(getCreatedCarByID.status).toBe(404);
        expect(getCreatedCarByID.data).toEqual({
                "status": "error",
                "message": "Car not found"
            }
        );

        console.log(getCreatedCarByID.data);
    });

    test.skip('delete user\'s car of Not logged In user', async () => {

        const getCreatedCars = await carsController.getCars();
        expect(getCreatedCars.status).toBe(200);
        console.log(getCreatedCars.data);
        console.log("--------------")

        const userCarID = getCreatedCars.data.data[0].id;

        const signOutResponse = await authController.logOut();
        expect(signOutResponse.status).toBe(200)

        const carOneDeletedResponse = await carsController.deleteCar(userCarID);
        expect(carOneDeletedResponse.status).toBe(401);
        expect(carOneDeletedResponse.data).toEqual({
            "status": "error",
            "message": "Not authenticated"
        });
        console.log(carOneDeletedResponse.data);
    });

    test.skip('delete user\'s car by unexpected endpoint', async () => {

        const getCreatedCars = await carsController.getCars();
        expect(getCreatedCars.status).toBe(200);
        console.log(getCreatedCars.data);
        console.log("--------------")

        const userCarID = getCreatedCars.data.data[0].id;

        const carOneDeletedResponse = await carsController.deleteCar(userCarID, '/api/cardess');
        expect(carOneDeletedResponse.status).toBe(404);
        expect(carOneDeletedResponse.data).toEqual({
            "status": "error",
            "message": "Not found"
        });
        console.log(carOneDeletedResponse.data);
        console.log("--------------")

        // check if car wasn't changed
        const getCreatedCarByID = await carsController.getCarById(userCarID);
        expect(getCreatedCarByID.status).toBe(200);
        expect(getCreatedCarByID.data.status).toBe("ok");
        expect(getCreatedCarByID.data.data).toMatchObject(getCreatedCars.data.data[0]);
        console.log(getCreatedCarByID.data.data);
    });

    test.skip('delete user\'s car by unexpected Car ID', async () => {

        const getCreatedCars = await carsController.getCars();
        expect(getCreatedCars.status).toBe(200);
        console.log(getCreatedCars.data);
        console.log("--------------")

        const userCarID = getCreatedCars.data.data[0].id;
        const irrelevantUserCarID = '120'
        // if value '120K' - then error status will be 500

        const carOneDeletedResponse = await carsController.deleteCar(irrelevantUserCarID);
        expect(carOneDeletedResponse.status).toBe(404);
        expect(carOneDeletedResponse.data).toEqual({
            "status": "error",
            "message": "Car not found"
        });
        console.log(carOneDeletedResponse.data);
        console.log("--------------")

        // check if car wasn't changed
        const getCreatedCarByID = await carsController.getCarById(userCarID);
        expect(getCreatedCarByID.status).toBe(200);
        expect(getCreatedCarByID.data.status).toBe("ok");
        expect(getCreatedCarByID.data.data).toMatchObject(getCreatedCars.data.data[0]);
        console.log(getCreatedCarByID.data.data);
    });

    test.skip('delete user\'s car without car ID', async () => {

        const getCreatedCars = await carsController.getCars();
        expect(getCreatedCars.status).toBe(200);
        console.log(getCreatedCars.data);
        console.log("--------------")

        const userCarID = getCreatedCars.data.data[0].id;

        const carOneDeletedResponse = await carsController.deleteCar();
        // in this case if value '<empty>>' - then error status will be 500

        expect(carOneDeletedResponse.status).toBe(400);
        expect(carOneDeletedResponse.data).toEqual({
            "status": "error",
            "message": "Unacceptable fields only or empty body are not allowed"
        });
        console.log(carOneDeletedResponse.data);
        console.log("--------------")

        // check if car wasn't changed
        const getCreatedCarByID = await carsController.getCarById(userCarID);
        expect(getCreatedCarByID.status).toBe(200);
        expect(getCreatedCarByID.data.status).toBe("ok");
        expect(getCreatedCarByID.data.data).toMatchObject(getCreatedCars.data.data[0]);
        console.log(getCreatedCarByID.data.data);
    });

});