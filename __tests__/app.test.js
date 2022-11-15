const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const { app } = require("../app");
const db = require("../db/connection.js");
const supertest = require("supertest");

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
          review_id: expect.any(Number),
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
        expect(response.body.msg).toBe("no review found with review_id");
      });
  });

  test("status 400 bad request", () => {
    return supertest(app)
      .get("/api/reviews/hiiii")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});
