import {describe, expect, beforeEach, test} from '@jest/globals';
import axios from 'axios'
import {wrapper} from 'axios-cookiejar-support';
import {CookieJar} from 'tough-cookie';
import AuthController from "../../../src/controllers/AuthController.js";
import {faker} from '@faker-js/faker';
import CarsController from "../../../src/controllers/CarsController.js";
import {QAUTO_API_URL} from "../../../src/constants/api.js";

describe("get Car model by ID test suite", () => {
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

    test.skip('get car model by ID that corresponds retrieved id from Brand', async () => {

        // finding brand and then finding it by title
        const carBrandsResponse = await carsController.getBrands();
        expect(carBrandsResponse.status).toBe(200)
        const foundBrandID = carBrandsResponse.data.data.find(brand => brand.title === "Audi").id;

        // find model ID
        const carModelsResponse = await carsController.getModels();
        expect(carModelsResponse.status).toBe(200);
        expect(carModelsResponse.data.status).toBe("ok");
        const requiredModelId = carModelsResponse.data.data[0].id;
        const requiredModelTitle = carModelsResponse.data.data[0].title;

        // find model by model ID with particular Brand ID
        const carModelByIDResponse = await carsController.getModelById(requiredModelId);
        expect(carModelByIDResponse.status).toBe(200);
        expect(carModelByIDResponse.data.data).toEqual(
            {
                "id": requiredModelId,
                "carBrandId": foundBrandID,
                "title": requiredModelTitle
            }
        );

        console.log(carModelByIDResponse.data.data);
    });

    test.skip('gets car model by id by broken endpoint', async () => {

        const carModelByIDWrongEndpointResponse = await carsController.getModelById(requiredModelId, `/api/cars/brvvands/`);
        expect(carModelByIDWrongEndpointResponse.status).toBe(404);
        expect(carModelByIDWrongEndpointResponse.data).toEqual(
            {
                "status": "error",
                "message": "Not found"
            }
        );
    });

    test.skip('get car model by id with Not number value', async () => {

        const carModelByIDNotANumberResponse = await carsController.getModelById("A");
        expect(carModelByIDNotANumberResponse.status).toBe(404);
        expect(carModelByIDNotANumberResponse.data).toEqual(
            {
                "status": "error",
                "message": "No car models found with this id"
            }
        );
    });

    test.skip('get car model by id with Empty value', async () => {

        const carModelByIDEmptyValueResponse = await carsController.getModelById();
        expect(carModelByIDEmptyValueResponse.status).toBe(404);
        expect(carModelByIDEmptyValueResponse.data).toEqual(
            {
                "status": "error",
                "message": "No car models found with this id"
            }
        );
    });

    test.skip('get car model by id with Space value', async () => {

        const carModelByIDSpaceValueResponse = await carsController.getModelById(" ");
        expect(carModelByIDSpaceValueResponse.status).toBe(404);
        console.log(carModelByIDSpaceValueResponse.data);
        expect(carModelByIDSpaceValueResponse.data).toEqual(
            {
                "status": "error",
                "message": "No car models found with this id"
            }
        );
    });

    test.skip('get car model by id with Special character value', async () => {

        const carModelByIDSpecialCharValueResponse = await carsController.getModelById("*");
        expect(carModelByIDSpecialCharValueResponse.status).toBe(404);
        expect(carModelByIDSpecialCharValueResponse.data).toEqual(
            {
                "status": "error",
                "message": "No car models found with this id"
            }
        );
    });
});