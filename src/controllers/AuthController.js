import BaseController from "./BaseController.js";

export default class AuthController extends BaseController {

    signUp(userData) {
        return this.client.post("/api/auth/signup",userData);
    }

    signIn(credentials) {
        return this.client.post("/api/auth/signin",credentials);
    }

    logOut(){
        return this.client.get("/api/auth/logout");
    }
}