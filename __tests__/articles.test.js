const supertest = require("supertest");
const app = require("../server");
const knex = require("../db/connection");

describe("/api", () => {
  describe("/articles", () => {
    beforeEach(() => {
      return knex.seed.run();
    });
    afterAll(() => {
      return knex.destroy();
    });
    describe("/:article_id", () => {
      test("GET: 200 - responds with an article object", () => {
        return supertest(app)
          .get("/api/articles/1")
          .expect(200)
          .then((res) => {
            expect(res.body.article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: 1,
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
          });
      });
      test("GET: 404 - responds with an appropriate error message when the user specifies a non-existent article_id", () => {
        return supertest(app)
          .get("/api/articles/700")
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("Uh oh... Article not found!");
          });
      });
      test("GET: 400 - responds with an appropriate error message when the user specifies incorrect type for article_id", () => {
        return supertest(app)
          .get("/api/articles/cats")
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe("Oh dear... Invalid article id!");
          });
      });
    });
  });
});
