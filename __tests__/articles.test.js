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
    test("GET: 200 - responds with an array of article objects", () => {
      return supertest(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });
    test("GET: 200 - default sort order is date asc", () => {
      return supertest(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at");
        });
    });
    test("GET: 200 - accepts a sort_by query", () => {
      return supertest(app)
        .get("/api/articles?sort_by=comment_count")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("comment_count");
        });
    });
    test("GET: 404 - responds with an appropriate error message where the sort_by column does not exist", () => {
      return supertest(app)
        .get("/api/articles?sort_by=cats")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Oh no... sort_by query not found!");
        });
    });
    test("GET: 200 - accepts an order query", () => {
      return supertest(app)
        .get("/api/articles?sort_by=votes&&order=desc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("votes", { descending: true });
        });
    });
    test("GET: 400 - returns an appropriate error message where the order query does not equal asc/desc", () => {
      return supertest(app)
        .get("/api/articles?order=cats")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Oh no... invalid order query!");
        });
    });
    test("GET: 200 - accepts an author query", () => {
      return supertest(app)
        .get("/api/articles?author=butter_bridge")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach((article) => {
            expect(article.author).toBe("butter_bridge");
          });
        });
    });
    test("GET: 404 responds with an appropriate error when the author query gives an author that does not exist", () => {
      return supertest(app)
        .get("/api/articles?author=me")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Whoops... author not found!");
        });
    });
    test("GET: 442 - responds with an appropriate error message where the author queried has no articles", () => {
      return supertest(app)
        .get("/api/articles?author=lurker")
        .expect(442)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            "Oh dear, the queried author has not created any articles!"
          );
        });
    });
    test("GET: 200 - accepts a topic query", () => {
      return supertest(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach((article) => {
            expect(article.topic).toBe("cats");
          });
        });
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
      test("PATCH: 200 - responds with an article object with the votes altered according to the request", () => {
        return supertest(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then((res) => {
            expect(res.body.article).toEqual({
              article_id: 1,
              title: "Living in the shadow of a great man",
              body: "I find this existence challenging",
              votes: 101,
              topic: "mitch",
              author: "butter_bridge",
              created_at: "2018-11-15T12:21:54.171Z",
              comment_count: 13,
            });
          });
      });
      test("PATCH: 200 - responds with an article object with unchanged votes if user not speicifed an inc_votes key", () => {
        return supertest(app)
          .patch("/api/articles/1")
          .send({})
          .expect(200)
          .then((res) => {
            expect(res.body.article.votes).toBe(100);
          });
      });
      test("PATCH: 400 - responds with an appropriate error message where the user gives a non-sensical inc_votes value", () => {
        return supertest(app)
          .patch("/api/articles/1")
          .send({ inc_votes: "cats" })
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe(
              "Hmmm, please specify an integer value for your requests inc_votes key!"
            );
          });
      });
      describe("/comments", () => {
        test("POST: 201 - responds with the posted comment", () => {
          return supertest(app)
            .post("/api/articles/1/comments")
            .send({ username: "butter_bridge", body: "This is my comment!!" })
            .expect(201)
            .then((res) => {
              expect(res.body.comment).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  author: "butter_bridge",
                  article_id: 1,
                  votes: 0,
                  created_at: expect.any(String),
                  body: "This is my comment!!",
                })
              );
            });
        });
        test("POST: 404 - responds with an appropriate error message if the specified username is not a user", () => {
          return supertest(app)
            .post("/api/articles/1/comments")
            .send({ username: "user123", body: "Hello I'm new here!!!" })
            .expect(404)
            .then((res) => {
              expect(res.body.msg).toBe(
                "Woah, you're new here! To post comments you need to be a registered user..."
              );
            });
        });
        test("GET: 200 - responds with an array of comment objects", () => {
          return supertest(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              const users = [
                "butter_bridge",
                "icellusedkars",
                "rogersop",
                "lurker",
              ];
              comments.forEach((comment) => {
                expect(comment).toEqual(
                  expect.objectContaining({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                  })
                );
                expect(users.includes(comment.author)).toBe(true);
              });
            });
        });
        test("GET: 404 - responds with appropriate error message if article_id is not found", () => {
          return supertest(app)
            .get("/api/articles/700/comments")
            .expect(404)
            .then((res) => {
              expect(res.body.msg).toBe("Uh oh... Article not found!");
            });
        });
        test("GET: 400 - responds with an appropriate error message if the given article_id is non-sensical", () => {
          return supertest(app)
            .get("/api/articles/cats/comments")
            .expect(400)
            .then((res) => {
              expect(res.body.msg).toBe("Oh dear... Invalid article id!");
            });
        });
        test("GET: 200 - response has default sort order of created_at asc", () => {
          return supertest(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).toBeSortedBy("created_at");
            });
        });
        test("GET: 200 - accepts a sort_by query", () => {
          return supertest(app)
            .get("/api/articles/1/comments?sort_by=votes")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).toBeSortedBy("votes");
            });
        });
        test("GET: 200 - accepts an order query", () => {
          return supertest(app)
            .get("/api/articles/1/comments?order=desc")
            .expect(200)
            .then(({ body: { comments } }) => {
              expect(comments).toBeSortedBy("created_at", { descending: true });
            });
        });
        test("GET: 404 - responds with an appropriate error message where the sort_by column queried does not exist", () => {
          return supertest(app)
            .get("/api/articles/1/comments?sort_by=cats")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Oh no... sort_by query not found!");
            });
        });
        test("GET: 400 - responds with an appropriate error message when the order query is not asc/desc", () => {
          return supertest(app)
            .get("/api/articles/1/comments?order=cats")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("Oh no... invalid order query!");
            });
        });
      });
    });
  });
});
