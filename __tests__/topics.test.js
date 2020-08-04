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
  });
});
