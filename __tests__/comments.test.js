const supertest = require("supertest");
const app = require("../server");
const knex = require("../db/connection");

describe("/api", () => {
  describe("/comments", () => {
    beforeEach(() => {
      return knex.seed.run();
    });
    afterAll(() => {
      return knex.destroy();
    });
    describe("/:comment_id", () => {
      test("PATCH: 200 - responds with the updated comment", () => {
        return supertest(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 20 })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment).toEqual({
              comment_id: 1,
              author: "butter_bridge",
              article_id: 9,
              votes: 36,
              created_at: "2017-11-22T12:36:03.389Z",
              body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            });
          });
      });
      test("PATCH: 200 - responds with the comment where the user did not specify an inc_votes key", () => {
        return supertest(app)
          .patch("/api/comments/1")
          .send({ random: "thing" })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment).toEqual({
              comment_id: 1,
              author: "butter_bridge",
              article_id: 9,
              votes: 16,
              created_at: "2017-11-22T12:36:03.389Z",
              body:
                "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            });
          });
      });
      test("PATCH: 404 - responds with an appropriate error message where the comment_id is not found", () => {
        return supertest(app)
          .patch("/api/comments/700")
          .send({ inc_votes: 3 })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Whoops... comment_id not found!");
          });
      });
      test("PATCH: 400 - responds with an appropriate error message where the comment_id given is of wrong type", () => {
        return supertest(app)
          .patch("/api/comments/cats")
          .send({ inc_votes: 2 })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Uh oh... bad request!");
          });
      });
      test("PATCH: 400 - responds with an appropriate error message where the inc_votes specified is of incorrect type", () => {
        return supertest(app)
          .patch("/api/comments/1")
          .send({ inc_votes: "cats" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Uh oh... bad request!");
          });
      });
      test("DELETE: 204", () => {
        return supertest(app)
          .del("/api/comments/1")
          .expect(204)
          .then(() => {
            return supertest(app)
              .get("/api/articles/9/comments")
              .then(({ body: { comments } }) => {
                expect(
                  comments.every((comment) => {
                    comment.comment_id !== 1;
                  })
                );
              });
          });
      });
      test("DELETE: 404 - responds with an appropriate error message where the comment_id is not found", () => {
        return supertest(app)
          .del("/api/comments/1000")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Whoops... comment not found!");
          });
      });
      test("DELETE: 400 - responds with an appropriate error message where the comment_id is of wrong type", () => {
        return supertest(app)
          .del("/api/comments/comment3")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Uh oh... bad request!");
          });
      });
      test("ALL: 404 - responds with an appropriate error message where the path is non-existent", () => {
        const methods = ["get", "post", "patch", "delete", "put"];
        const promises = methods.map((method) => {
          return supertest(app)
            [method]("/api/comment/2")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Uh oh... path not found!");
            });
        });
        return Promise.all(promises);
      });
      test("INVALID METHODS: 405 - responds with an appropriate error message when using an invalid method on endpoint", () => {
        const invalidMethods = ["post", "put", "get"];
        const promises = invalidMethods.map((method) => {
          return supertest(app)
            [method]("/api/comments/1")
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
