import * as banana from "../controller/bananaC";

export const routes = (app) => {

    // Add api's for /banana route
    app.route('/banana')
        .get(banana.getBananas)
        .post(banana.addBanana);

    // Add api's for /banana/:ID route
    app.route('/banana/:id')
        .get(banana.getBanana)
        .delete(banana.deleteBanana);

};

