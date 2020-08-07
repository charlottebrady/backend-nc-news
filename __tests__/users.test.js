const supertest = require("supertest");
const app = require("../server");
const knex = require("../db/connection");

describe("/api", () => {
  describe("/users", () => {
    beforeEach(() => {
      return knex.seed.run();
    });
    afterAll(() => {
      return knex.destroy();
    });
    describe("/:username", () => {
      test("GET: 200 - responds with a user object", () => {
        return supertest(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: "butter_bridge",
                avatar_url: expect.any(String),
                name: expect.any(String),
              })
            );
          });
      });
      test("GET: 404 - responds with an appropriate error if the specified user does not exist", () => {
        return supertest(app)
          .get("/api/users/user123")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Whoops... user not found!");
          });
      });
      test("ALL: 404 - responds with an appropriate error message where the path is non-existent", () => {
        const methods = ["get", "post", "patch", "delete", "put"];
        const promises = methods.map((method) => {
          return supertest(app)
            [method]("/apo/user/butter_bridge")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Uh oh... path not found!");
            });
        });
        return Promise.all(promises);
      });
      test("INVALID METHODS: 405 - responds with an appropriate error message when using an invalid method on endpoint", () => {
        const invalidMethods = ["post", "put", "delete", "patch"];
        const promises = invalidMethods.map((method) => {
          return supertest(app)
            [method]("/api/users/butter_bridge")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Oops... invalid method!");
            });
        });
        return Promise.all(promises);
      });
    });
  });
});
