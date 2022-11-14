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

// will separate
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
