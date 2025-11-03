import {describe, expect, beforeEach, test} from '@jest/globals';
import axios from 'axios'
import {wrapper} from 'axios-cookiejar-support';
import {CookieJar} from 'tough-cookie';
import AuthController from "../../../src/controllers/AuthController.js";
import {faker} from '@faker-js/faker';
import CarsController from "../../../src/controllers/CarsController.js";
import {QAUTO_API_URL} from "../../../src/constants/api.js";


describe("get Car brand by ID test suite", () => {
    const jar = new CookieJar();
    const client = wrapper(axios.create({
        baseURL: QAUTO_API_URL,
        validateStatus: () => true,
        jar
    }));

    const authController = new AuthController(client);
    const carsController = new CarsController(client);


    const requiredBrandId = 1;

    const expectedCarBrandList =
        {
            "id": requiredBrandId,
            "title": expect.any(String),
            "logoFilename": expect.any(String)
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

    test.skip('gets car brand by id', async () => {

        const carBrandsResponse = await carsController.getBrandById(requiredBrandId);
        expect(carBrandsResponse.status).toBe(200);
        expect(carBrandsResponse.data.data).toEqual(expectedCarBrandList);
    });

    test.skip('gets car brand by id by broken endpoint', async () => {

        const carBrandByIDWrongEndpointResponse = await carsController.getBrandById(requiredBrandId, `/api/cars/brvvands/`);
        expect(carBrandByIDWrongEndpointResponse.status).toBe(404);
        expect(carBrandByIDWrongEndpointResponse.data).toEqual(
            {
                "status": "error",
                "message": "Not found"
            }
        );
    });

    test.skip('gets car brand by id with Not number value', async () => {

        const carBrandByIDNotANumberResponse = await carsController.getBrandById("A");
        expect(carBrandByIDNotANumberResponse.status).toBe(404);
        expect(carBrandByIDNotANumberResponse.data).toEqual(
            {
                "status": "error",
                "message": "No car brands found with this id"
            }
        );
    });

    test.skip('gets car brand by id with Empty value', async () => {

        const carBrandByIDEmptyValueResponse = await carsController.getBrandById();
        expect(carBrandByIDEmptyValueResponse.status).toBe(404);
        expect(carBrandByIDEmptyValueResponse.data).toEqual(
            {
                "status": "error",
                "message": "No car brands found with this id"
            }
        );
    });

    test.skip('gets car brand by id with Space value', async () => {

        const carBrandByIDSpaceValueResponse = await carsController.getBrandById(" ");
        expect(carBrandByIDSpaceValueResponse.status).toBe(404);
        console.log(carBrandByIDSpaceValueResponse.status);
        expect(carBrandByIDSpaceValueResponse.data).toEqual(
            {
                "status": "error",
                "message": "No car brands found with this id"
            }
        );
    });

    test.skip('gets car brand by id with Special character value', async () => {

        const carBrandByIDSpecialCharValueResponse = await carsController.getBrandById("*");
        expect(carBrandByIDSpecialCharValueResponse.status).toBe(404);
        expect(carBrandByIDSpecialCharValueResponse.data).toEqual(
            {
                "status": "error",
                "message": "No car brands found with this id"
            }
        );
    });


    test.skip('get car brand by retrieved id from Brand', async () => {

        // finding brand and then finding it by ID
        const carBrandsResponse = await carsController.getBrands();
        expect(carBrandsResponse.status).toBe(200)
        const foundBrandID = carBrandsResponse.data.data[0].id;
        const foundBrandTitle  = carBrandsResponse.data.data[0].title;
        const foundBranDLogo = carBrandsResponse.data.data[0].logoFilename;

        const carBrandByIDResponse = await carsController.getBrandById(foundBrandID);
        expect(carBrandByIDResponse.status).toBe(200);
        expect(carBrandByIDResponse.data.data).toEqual(
            {
                "id": foundBrandID,
                "title": foundBrandTitle,
                "logoFilename": foundBranDLogo
            }
        );
    });

});