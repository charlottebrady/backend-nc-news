const supertest = require("supertest");
const app = require("../server");
const knex = require("../db/connection");

describe("/api", () => {
  describe("/topics", () => {
    beforeEach(() => {
      return knex.seed.run();
    });
    afterAll(() => {
      return knex.destroy();
    });
    test("GET: 200 - responds with an array of topic objects", () => {
      return supertest(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          expect(res.body.topics).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              }),
            ])
          );
        });
    });
    test("GET: 200 - default sort order is by slug ascending", () => {
      return supertest(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          expect(res.body.topics).toBeSortedBy("slug");
        });
    });
    test("ALL: 404 - responds with an appropriate error message where the path is non-existent", () => {
      const methods = ["get", "post", "patch", "delete", "put"];
      const promises = methods.map((method) => {
        return supertest(app)
          [method]("/apj/topicz")
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
          [method]("/api/topics")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Oops... invalid method!");
          });
      });
      return Promise.all(promises);
    });
  });
});
