import BaseController from "./BaseController.js";
import * as url from "node:url";

export default class CarsController extends BaseController {

    getBrands(url = '/api/cars/brands') {
        return this.client.get(url)
    }

    getBrandById(id, url = `/api/cars/brands/`) {
        return this.client.get(url + id)
    }

    getModels(url = "/api/cars/models") {
        return this.client.get(url)
    }

    getModelById(id, url = `/api/cars/models/`) {
        return this.client.get(url + id)
    }

    postNewCar(carData, url = '/api/cars') {
        return this.client.post(url, carData);
    }

    getCarById(id, url = `/api/cars/`) {
        return this.client.get(url + id);
    }

    getCars(url = '/api/cars') {
        return this.client.get(url);
    }

    putCar(NewCarData, id, url = '/api/cars/') {
        return this.client.put(url + id, NewCarData);
    }

    deleteCar(id, url = `/api/cars/`) {
        return this.client.delete(url + id);
    }
}