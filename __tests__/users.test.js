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
          .then((res) => {
            expect(res.body.user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
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
          .then((res) => {
            expect(res.body.msg).toBe("Whoops... User not found!");
          });
      });
    });
  });
});
