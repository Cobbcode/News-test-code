const endpoints = require("./ticket 13.json")
=
describe.only("GET /api", () => {
    test("Responds with json of all available endpoints of api", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then((res) => {
          const apiJson = res.body.api;
          expect(apiJson).toEqual({
            "GET /api": {
              description:
                "serves up a json representation of all the available endpoints of the api",
            },
            "GET /api/topics": {
              description: "serves an array of all topics",
              queries: [],
              exampleResponse: {
                topics: [{ slug: "football", description: "Footie!" }],
              },
            },
            "GET /api/articles": {
              description: "serves an array of all topics",
              queries: ["author", "topic", "sort_by", "order"],
              exampleResponse: {
                articles: [
                  {
                    title: "Seafood substitutions are increasing",
                    topic: "cooking",
                    author: "weegembump",
                    body: "Text from the article..",
                    created_at: 1527695953341,
                  },
                ],
              },
            },
          });
        });
    });
    test("Responds with 404 if invalid endpoint", () => {
      return request(app).get("/apo").expect(404);
    });
  });
  

// APP
app.get("/api", getApi);

// Controller:
const api = require("../endpoints.json")
exports.getApi = (req,res,next) => {
    res.status(200).json({api})
  };
  
