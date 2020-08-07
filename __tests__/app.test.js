const supertest = require("supertest");
const app = require("../server");
const knex = require("../db/connection");

describe("app errors", () => {
  beforeEach(() => {
    return knex.seed.run();
  });
  afterAll(() => {
    return knex.destroy();
  });
  test("ALL: 404 - responds with an appropriate error message for a non-existent path", () => {
    return supertest(app)
      .get("/apj/articles")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Uh oh... path not found!");
      });
  });
});
