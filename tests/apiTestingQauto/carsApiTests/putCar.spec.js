import {describe, expect, beforeEach, test} from '@jest/globals';
import axios from 'axios'
import {wrapper} from 'axios-cookiejar-support';
import {CookieJar} from 'tough-cookie';
import AuthController from "../../../src/controllers/AuthController.js";
import {faker} from '@faker-js/faker';
import CarsController from "../../../src/controllers/CarsController.js";
import {QAUTO_API_URL} from "../../../src/constants/api.js";
import {initialMileageOne, updatedMileage} from "../../fixtures/apiCarFixtures.js";

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
            "mileage": initialMileageOne
        }
        const carOneCreateResponse = await carsController.postNewCar(carDataOne);
        expect(carOneCreateResponse.status).toBe(201);
    })

    test.skip('put new mileage to user car', async () => {

        const getCreatedCars = await carsController.getCars();
        expect(getCreatedCars.status).toBe(200);
        console.log(getCreatedCars.data);
        console.log("--------------")

        const carDataOneUpdated = {
            "carBrandId": getCreatedCars.data.data[0].carBrandId,
            "carModelId": getCreatedCars.data.data[0].carModelId,
            "mileage": updatedMileage
        }

        const carOneModifiedResponse = await carsController.putCar(carDataOneUpdated, getCreatedCars.data.data[0].id);
        expect(carOneModifiedResponse.status).toBe(200);
        expect(carOneModifiedResponse.data.data).toEqual({
            "id": getCreatedCars.data.data[0].id,
            "carBrandId": getCreatedCars.data.data[0].carBrandId,
            "carModelId": getCreatedCars.data.data[0].carModelId,
            "initialMileage": getCreatedCars.data.data[0].initialMileage,
            "carCreatedAt": expect.any(String),
            "updatedMileageAt": expect.any(String),
            "mileage": carDataOneUpdated.mileage,
            "brand": getCreatedCars.data.data[0].brand,
            "model": getCreatedCars.data.data[0].model,
            "logo": getCreatedCars.data.data[0].logo
        });
        console.log(carOneModifiedResponse.data.data);

        console.log("--------------")

        // check if car was changed
        const getCreatedCarByID = await carsController.getCarById(getCreatedCars.data.data[0].id);
        expect(getCreatedCarByID.status).toBe(200);
        expect(getCreatedCarByID.data.status).toBe("ok");
        expect(getCreatedCarByID.data.data).toEqual({
            "id": getCreatedCars.data.data[0].id,
            "carBrandId": getCreatedCars.data.data[0].carBrandId,
            "carModelId": getCreatedCars.data.data[0].carModelId,
            "initialMileage": getCreatedCars.data.data[0].initialMileage,
            "carCreatedAt": expect.any(String),
            "updatedMileageAt": expect.any(String),
            "mileage": carDataOneUpdated.mileage,
            "brand": getCreatedCars.data.data[0].brand,
            "model": getCreatedCars.data.data[0].model,
            "logo": getCreatedCars.data.data[0].logo
        });

        console.log(getCreatedCarByID.data.data);
    });

    test.skip('put new mileage to user car of Not logged In user', async () => {

        const getCreatedCars = await carsController.getCars();
        expect(getCreatedCars.status).toBe(200);
        console.log(getCreatedCars.data);
        console.log("--------------")

        const signOutResponse = await authController.logOut();
        expect(signOutResponse.status).toBe(200)

        const carDataOneUpdated = {
            "carBrandId": getCreatedCars.data.data[0].carBrandId,
            "carModelId": getCreatedCars.data.data[0].carModelId,
            "mileage": updatedMileage
        }

        const carOneModifiedResponse = await carsController.putCar(carDataOneUpdated, getCreatedCars.data.data[0].id);
        expect(carOneModifiedResponse.status).toBe(401);
        expect(carOneModifiedResponse.data).toEqual({
            "status": "error",
            "message": "Not authenticated"
        });
        console.log(carOneModifiedResponse.data);

    });

    test.skip('put new mileage to user car by unexpected endpoint', async () => {

        const getCreatedCars = await carsController.getCars();
        expect(getCreatedCars.status).toBe(200);
        console.log(getCreatedCars.data);
        console.log("--------------")

        const carDataOneUpdated = {
            "carBrandId": getCreatedCars.data.data[0].carBrandId,
            "carModelId": getCreatedCars.data.data[0].carModelId,
            "mileage": updatedMileage
        }

        const carOneModifiedResponse = await carsController.putCar(carDataOneUpdated, getCreatedCars.data.data[0].id, '/api/cardess');
        expect(carOneModifiedResponse.status).toBe(404);
        expect(carOneModifiedResponse.data).toEqual({
            "status": "error",
            "message": "Not found"
        });
        console.log(carOneModifiedResponse.data);
        console.log("--------------")

        const getCreatedCarByID = await carsController.getCarById(getCreatedCars.data.data[0].id);
        expect(getCreatedCarByID.status).toBe(200);
        expect(getCreatedCarByID.data.status).toBe("ok");
        expect(getCreatedCarByID.data.data).toMatchObject(getCreatedCars.data.data[0]);
        console.log(getCreatedCarByID.data.data);
    });

    test.skip('put new mileage to user car by unexpected Car ID', async () => {

        const getCreatedCars = await carsController.getCars();
        expect(getCreatedCars.status).toBe(200);
        console.log(getCreatedCars.data);
        console.log("--------------")
        const irrelevantUserCarID = '12FDvcx*'

        const carDataOneUpdated = {
            "carBrandId": getCreatedCars.data.data[0].carBrandId,
            "carModelId": getCreatedCars.data.data[0].carModelId,
            "mileage": updatedMileage
        }

        const carOneModifiedResponse = await carsController.putCar(carDataOneUpdated, irrelevantUserCarID);
        expect(carOneModifiedResponse.status).toBe(404);
        expect(carOneModifiedResponse.data).toEqual({
            "status": "error",
            "message": "Car not found"
        });
        console.log(carOneModifiedResponse.data);
        console.log("--------------")

        // check if car wasn't changed
        const getCreatedCarByID = await carsController.getCarById(getCreatedCars.data.data[0].id);
        expect(getCreatedCarByID.status).toBe(200);
        expect(getCreatedCarByID.data.status).toBe("ok");
        expect(getCreatedCarByID.data.data).toMatchObject(getCreatedCars.data.data[0]);
        console.log(getCreatedCarByID.data.data);
    });

    test.skip('put new mileage to user car without body in request', async () => {

        const getCreatedCars = await carsController.getCars();
        expect(getCreatedCars.status).toBe(200);
        console.log(getCreatedCars.data);
        console.log("--------------")

        const userCarID = getCreatedCars.data.data[0].id;

        const carDataOneUpdated = {}

        const carOneModifiedResponse = await carsController.putCar(carDataOneUpdated, userCarID);
        expect(carOneModifiedResponse.status).toBe(400);
        expect(carOneModifiedResponse.data).toEqual({
            "status": "error",
            "message": "Unacceptable fields only or empty body are not allowed"
        });
        console.log(carOneModifiedResponse.data);
        console.log("--------------")
        // check if car wasn't changed
        const getCreatedCarByID = await carsController.getCarById(userCarID);
        expect(getCreatedCarByID.status).toBe(200);
        expect(getCreatedCarByID.data.status).toBe("ok");
        expect(getCreatedCarByID.data.data).toMatchObject(getCreatedCars.data.data[0]);
        console.log(getCreatedCarByID.data.data);
    });

});