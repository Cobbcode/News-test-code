// APP TEST
describe("GET /api/articles?topic=cats", () => {
  test("Responds articles filtered by cats", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((res) => {
        const articles = res.body.articles;
        expect(articles).toHaveLength(3); // change
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: "cat",
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("Responds with empty array if query value valid, but no articles", () => {
    return request(app)
      .get("/api/articles?topic=bandedmongoose")
      .expect(200)
      .then((res) => {
        const articles = res.body.articles;
        expect(articles).toHaveLength(0);
      });
  });
  test("Responds with 404 if query property not found", () => {
    return request(app)
      .get("/api/articles?topicoo=cats")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Query property does not exist");
      });
  });
  test("Responds with 400 if invalid query syntax", () => {
    return request(app)
      .get("/api/articles?50=nope")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Query value does not exist");
      });
  });
  describe("sort_by query works for every column", () => {
    test("articles are sorted by query author", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200) //
        .then((res) => {
          const articles = res.body.articles;
          expect(articles).toBeSortedBy("author");
        });
    });
    test("articles are sorted by query article_id", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id")
        .expect(200) //
        .then((res) => {
          const articles = res.body.articles;
          expect(articles).toBeSortedBy("article_id");
        });
    });
    test("articles are sorted by query topic", () => {
      return request(app)
        .get("/api/articles?sort_by=topic")
        .expect(200) //
        .then((res) => {
          const articles = res.body.articles;
          expect(articles).toBeSortedBy("topic");
        });
    });
    test("articles are sorted by query created_at", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at")
        .expect(200) //
        .then((res) => {
          const articles = res.body.articles;
          expect(articles).toBeSortedBy("created_at");
        });
    });
    test("articles are sorted by query votes", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200) //
        .then((res) => {
          const articles = res.body.articles;
          expect(articles).toBeSortedBy("votes");
        });
    });
    test("articles are sorted by query comment_count", () => {
      return request(app)
        .get("/api/articles?sort_by=comment_count")
        .expect(200) //
        .then((res) => {
          const articles = res.body.articles;
          expect(articles).toBeSortedBy("comment_count");
        });
    });
  });
  test("Returns specifed query sort order", () => {
    return request(app)
      .get("/api/articles?order=desc")
      .expect(200) //
      .then((res) => {
        const articles = res.body.articles;
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

// CONTROLLER
exports.getArticles = (req, res, next) => {
  const { topic } = req.query;
  const { sort_by } = req.query;
  const { order } = req.query;

  fetchArticles(topic, sort_by, order)
    .then((articles) => {
      res.send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

// MODEL
exports.fetchArticles = (topic, sort_by = "created_at", order = "asc") => {
  const sortGreenlist = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];

  if (order !== "asc" && order !== "desc") {
    return Promise.reject({ status: 400, msg: "invalid order query" });
  }

  if (!sortGreenlist.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "invalid sort query" });
  }

  let queryStr = `SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, COUNT(comments.body)::INT AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;

 

  return db
    .query(
      `
      WHERE topic = $1
      
      GROUP BY articles.article_id
      ORDER BY ${sort_by} ${order};`,
      []
    )
    .then((result) => {
      return result.rows;
    });
};
