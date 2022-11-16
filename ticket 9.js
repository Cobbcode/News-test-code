// APP TEST
describe("GET /api/users", () => {
  test("Responds with all users, each with correct properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        const users = res.body.users;
        expect(users).toHaveLength(3); // change
        users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
  test("Responds with 404 if invalid endpoint", () => {
    return request(app).get("/api/eggs").expect(404);
  });
});

// APP
app.get("/api/users", getUsers);

// Controller
exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.send({ users });
    })
    .catch((err) => [next(err)]);
};

// Model
exports.fetchUsers = () => {
  return db
    .query(
      `SELECT username, name, avatar_url
        FROM users;`
    )
    .then((result) => {
      return result.rows;
    });
};



