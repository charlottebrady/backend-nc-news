process.env.NODE_ENV = "test";

const {
  formatDates,
  makeRefObj,
  formatComments,
  formatCommentCount,
} = require("../db/utils/utils");

const { articleData, commentData } = require("../db/data");

describe("formatDates", () => {
  test("returns a new array", () => {
    const test = [
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171,
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: 1163852514171,
      },
      {
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: 1037708514171,
      },
    ];
    expect(formatDates(test)).not.toBe(test);
    expect(Array.isArray(formatDates(test))).toBe(true);
    expect(formatDates(test).length).toBe(test.length);
  });
  test("returns a PSQL timestamp for one article", () => {
    const test = [
      {
        title: "Moustache",
        topic: "mitch",
        author: "butter_bridge",
        body: "Have you seen the size of that thing?",
        created_at: 154700514171,
      },
    ];
    expect(formatDates(test)[0].created_at).toEqual(new Date(154700514171));
  });
  test("returns PSQL timestamps for an array of articles", () => {
    const test = [
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: 1289996514171,
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: 1163852514171,
      },
      {
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: 1037708514171,
      },
    ];
    expect(formatDates(test)).toEqual([
      {
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: new Date(1289996514171),
      },
      {
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body:
          "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: new Date(1163852514171),
      },
      {
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: new Date(1037708514171),
      },
    ]);
  });
  test("does not mutate original input array", () => {
    const test = [
      {
        title: "Am I a cat?",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
        created_at: 280844514171,
      },
      {
        title: "Moustache",
        topic: "mitch",
        author: "butter_bridge",
        body: "Have you seen the size of that thing?",
        created_at: 154700514171,
      },
    ];
    formatDates(test);
    expect(test).toEqual([
      {
        title: "Am I a cat?",
        topic: "mitch",
        author: "icellusedkars",
        body:
          "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
        created_at: 280844514171,
      },
      {
        title: "Moustache",
        topic: "mitch",
        author: "butter_bridge",
        body: "Have you seen the size of that thing?",
        created_at: 154700514171,
      },
    ]);
  });
});

describe("makeRefObj", () => {
  test("returns a reference object for one article", () => {
    const test = [{ article_id: 1, title: "A" }];
    expect(makeRefObj(test)).toEqual({
      A: 1,
    });
  });
  test("returns a reference object for an array of articles", () => {
    const test = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" },
      { article_id: 3, title: "C" },
    ];
    expect(makeRefObj(test)).toEqual({ A: 1, B: 2, C: 3 });
  });
  test("does not mutate original articles array", () => {
    const test = [
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" },
      { article_id: 3, title: "C" },
    ];
    makeRefObj(test);
    expect(test).toEqual([
      { article_id: 1, title: "A" },
      { article_id: 2, title: "B" },
      { article_id: 3, title: "C" },
    ]);
  });
});

describe("formatComments", () => {
  test("returns the formatted comment for an array of one comment", () => {
    const test = [
      {
        body: "This morning, I showered for nine minutes.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 975242163389,
      },
    ];
    const testRef = { "Living in the shadow of a great man": 23 };
    expect(formatComments(test, testRef)).toEqual([
      {
        author: "butter_bridge",
        article_id: 23,
        created_at: new Date(975242163389),
        votes: 16,
        body: "This morning, I showered for nine minutes.",
      },
    ]);
  });
  test("returns the formatted comments for an array of comments", () => {
    const test = [
      {
        body: "This is a bad article name",
        belongs_to: "A",
        created_by: "butter_bridge",
        votes: 1,
        created_at: 1038314163389,
      },
      {
        body: "The owls are not what they seem.",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: "icellusedkars",
        votes: 20,
        created_at: 1006778163389,
      },
      {
        body: "This morning, I showered for nine minutes.",
        belongs_to: "Living in the shadow of a great man",
        created_by: "butter_bridge",
        votes: 16,
        created_at: 975242163389,
      },
    ];
    const testRef = {
      A: 1,
      "They're not exactly dogs, are they?": 2,
      "Living in the shadow of a great man": 3,
    };
    expect(formatComments(test, testRef)).toEqual([
      {
        body: "This is a bad article name",
        article_id: 1,
        author: "butter_bridge",
        votes: 1,
        created_at: new Date(1038314163389),
      },
      {
        body: "The owls are not what they seem.",
        article_id: 2,
        author: "icellusedkars",
        votes: 20,
        created_at: new Date(1006778163389),
      },
      {
        body: "This morning, I showered for nine minutes.",
        article_id: 3,
        author: "butter_bridge",
        votes: 16,
        created_at: new Date(975242163389),
      },
    ]);
  });
  test("returns a new array", () => {
    const test = [
      {
        body: "body",
        belongs_to: "Title",
        created_by: "User",
        votes: 0,
        created_at: 975242163389,
      },
    ];
    const testRef = { Title: 14 };
    expect(formatComments(test, testRef)).not.toBe(test);
  });
  test("does not mutate original comments array", () => {
    const test = [
      {
        body: "body",
        belongs_to: "Title",
        created_by: "User",
        votes: 0,
        created_at: 975242163389,
      },
    ];
    const testRef = { Title: 14 };
    formatComments(test, testRef);
    expect(test).toEqual([
      {
        body: "body",
        belongs_to: "Title",
        created_by: "User",
        votes: 0,
        created_at: 975242163389,
      },
    ]);
  });
});

describe("formatCommentCount", () => {
  test("returns an array of article objects where the comment_count has been parsed to an integer", () => {
    expect(
      formatCommentCount([
        { article_id: 1, comment_count: "12" },
        { article_id: 2, comment_count: "3" },
        { article_id: 3, comment_count: "0" },
      ])
    ).toEqual([
      { article_id: 1, comment_count: 12 },
      { article_id: 2, comment_count: 3 },
      { article_id: 3, comment_count: 0 },
    ]);
  });
  test("does not mutate original articles array", () => {
    const test = [
      { article_id: 1, comment_count: "12" },
      { article_id: 2, comment_count: "3" },
      { article_id: 3, comment_count: "0" },
    ];
    formatCommentCount(test);
    expect(test).toEqual([
      { article_id: 1, comment_count: "12" },
      { article_id: 2, comment_count: "3" },
      { article_id: 3, comment_count: "0" },
    ]);
  });
  test("returns a new array", () => {
    const test = [
      { article_id: 1, comment_count: "12" },
      { article_id: 2, comment_count: "3" },
      { article_id: 3, comment_count: "0" },
    ];
    expect(formatCommentCount(test)).not.toBe(test);
  });
});
