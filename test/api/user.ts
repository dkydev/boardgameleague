import {request, login, testUser, getTestUser} from "../common";
import {expect} from "chai";
import {model as User} from "../../server/api/user/model";

describe("# User", () => {

    it("should register a user", async () => {

        const testRegisterUser = {
            username: "registerTestUsername",
            email: "test-email@hotmail.com",
            password: "testPassword"
        };

        // Clean up user_leagues if re-test.
        await User.remove({});

        // Register.
        let res = await request.post(process.env.API_BASE + "users/register").send(testRegisterUser).expect(200);

        expect(res.body).to.not.be.empty;
    });

    it("should fail to register a user", async () => {

        const noData = {};

        // Register.
        let res = await request.post(process.env.API_BASE + "users/register").send(noData).expect(400);

        expect(res.body.message).to.equal("Invalid parameters.");
    });

    it("should view a user", async () => {
        let token: string = await login();
        let res = await request.get(process.env.API_BASE + `users/${(await getTestUser()).id}`)
            .set('Authorization', 'Bearer ' + token)
            .expect(200);

        // Should have a user object.
        expect(res.body.user).to.not.be.empty;

        // Username is the test username.
        expect(res.body.user.username).to.equal(testUser.username);

        // User leagues should be an empty array.
        expect(res.body.user.user_leagues).to.not.be.undefined;

        // Password should not be returned.
        expect(res.body.user.password).to.be.undefined;
    });

    it("should not find a user to view", async () => {
        let token: string = await login();
        let res = await request.get(process.env.API_BASE + "users/notauserid")
            .set('Authorization', 'Bearer ' + token)
            .expect(400);

        // Should have a user object.
        expect(res.body.message).to.equal("User not found.");
    });

    it("should not get users", async () => {
        let token: string = await login();
        let res = await request.get(process.env.API_BASE + "users/")
            .set('Authorization', 'Bearer ' + token)
            .expect(404);
    });

});