// app test
describe("DELETE /comments/:comment_id", () => {
  test("Returns 204, and empty response body", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then((res) => {
        expect(res.body.msg).toBe("{}");
      });
  });
  test("Responds with 404 if valid, but non existent comment ID", () => {
    return request(app)
      .get("/api/comments/0")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Comment ID does not exist");
      });
  });
  test("Responds with 400 if non-valid comment ID syntax (string)", () => {
    return request(app)
      .get("/api/comments/slendermongoose")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid comment ID - must be a number");
      });
  });
});

// APP
app.delete("/api/comments/:comment_id", deleteCommentById);

// CONTROLLER
exports.deleteCommentById = (req, res, next) => {
  const comment_id = req.params.comment_id;
  removeCommentById(comment_id)
    .then((emptyBody) => {
      res.status(204).send({ emptyBody });
    })
    .catch((err) => {
      next(err);
    });
};

// MODEL
exports.removeCommentById = (comment_id) => {
    checkDataExists("comments","comment_id",comment_id).then(() => {
      return db.query(
        `DELETE FROM comments WHERE comment_id = $1;`,
        [comment_id]
      );
    });
  };

