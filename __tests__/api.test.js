const supertest = require("supertest");
const app = require("../server");
const knex = require("../db/connection");

describe("/api", () => {
  beforeEach(() => {
    return knex.seed.run();
  });
  afterAll(() => {
    return knex.destroy();
  });
  test("GET: 200 - responds with a JSON object describing all available endpoints", () => {
    return supertest(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual({
          "GET: /api/topics": "responds with all registered topics",
          "GET: /api/articles":
            "responds with al registered article objects, accepts sort_by, order, author and topic queries",
          "GET: /api/articles/:article_id":
            "responds with the specified article corresponding to the given id",
          "PATCH: /api/articles/:article_id":
            "allows the user to vote on the specified article, user must provide an object in the form {inc_votes: user_vote} where user_vote is an integer, responds with the updated article",
          "POST: /api/articles/:article_id/comments":
            "allows a registered user to post a comment on the specified article, the user must provide an object in the form {username: user, body: your_comment}, responds with the posted comment",
          "GET: /api/articles/:article_id/comments":
            "responds with all comments related to the specified article_id",
          "GET: /api/users/:username":
            "responds with the specified user if registered",
          "PATCH: /api/comments/:comment_id":
            "allows the user to vote on a specified comment, user must provide an object in the form {inc_votes: user_votes} where user_votes is an integer, responds with the updated comment",
          "DELETE: /api/comments/:comment_id":
            "allows the user to delete the specified comment",
        });
      });
  });
  test("ALL: 404 - responds with an appropriate error message where the path is not found", () => {
    const methods = ["get", "patch", "post", "put", "delete"];
    const promises = methods.map((method) => {
      return supertest(app)
        [method]("/apii")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Uh oh... path not found!");
        });
    });
  });
  test("INVALID METHODS: 405 - responds with an appropriate error message where an invalid method is used", () => {
    const invalidMethods = ["patch", "post", "put", "delete"];
    const promises = invalidMethods.map((method) => {
      return supertest(app)
        [method]("/api")
        .expect(405)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Oops... invalid method!");
        });
    });
    return Promise.all(promises);
  });
});
