const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const { app } = require("../app");
const db = require("../db/connection.js");
const supertest = require("supertest");
const { response } = require("express");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  if (db.end) db.end();
});

describe("GET /api/categories", () => {
  test("status 200 should return array of catagories objects", () => {
    return supertest(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body.categories).toBeInstanceOf(Array);
        expect(body.categories.length > 0).toBe(true);
        body.categories.forEach((catagory) => {
          expect(catagory).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/reviews", () => {
  test("status 200 should return array of review objects", () => {
    return supertest(app)
      .get("/api/reviews")
      .expect(200)
      .then(({ body }) => {
        expect(body.reviews).toBeInstanceOf(Array);
        expect(body.reviews.length > 0).toBe(true);
        expect(body.reviews).toBeSortedBy("created_at", { descending: true });
        body.reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
});

describe("GET /api/reviews/:review_id ", () => {
  test("status 200 should return review object", () => {
    return supertest(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toBeInstanceOf(Object);
        expect(body.review).toMatchObject({
          review_id: 1,
          title: expect.any(String),
          review_body: expect.any(String),
          designer: expect.any(String),
          review_img_url: expect.any(String),
          votes: expect.any(Number),
          category: expect.any(String),
          owner: expect.any(String),
          created_at: expect.any(String),
        });
      });
  });

  test("status 404 no reviews", () => {
    return supertest(app)
      .get("/api/reviews/30")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("invalid ID");
      });
  });

  test("status 400 bad request", () => {
    return supertest(app)
      .get("/api/reviews/hiiii")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("status 200  return array of comments for given review_id", () => {
    return supertest(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments.length > 0).toBe(true);
        expect(body.comments).toBeSortedBy("created_at", { descending: true });
        body.comments.forEach((review) => {
          expect(review).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            review_id: 3,
          });
        });
      });
  });
  test("status code 200 No comments found", () => {
    return supertest(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toEqual([]);
      });
  });

  test("status 400: invalid ID ", () => {
    return supertest(app)
      .get("/api/reviews/HIIIII/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("bad request");
      });
  });

  test("status 404: review id not found", () => {
    return supertest(app)
      .get("/api/reviews/300/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("invalid ID");
      });
  });
});

describe("POST /api/reviews/:review_id/comments ", () => {
  test("status 201: Post new comment", () => {
    const newComment = {
      username: "kieran",
      body: "Hello this is the comment that kieran created",
    };
    return supertest(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toMatchObject({
          votes: 0,
          author: newComment.username,
          review_id: 1,
          created_at: expect.any(String),
        });
      });
  });

  test("Status 400: malformed body / missing required fields ", () => {
    const newComment = {
      username: "kieran",
      body: "Hello this is the comment that kieran created",
    };
    return supertest(app)
      .post("/api/reviews/1/comments")
      .send({ newComment })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid comment created");
      });
  });

  test("status 400: bad request", () => {
    const newComment = {
      username: "kieran",
      body: "Hello this is the comment that kieran created",
    };
    return supertest(app)
      .post("/api/reviews/1/comments")
      .send({ newComment })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});
