const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "movieData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
    SELECT
    movie_name
    FROM
    movie
    ORDER BY
    movie_id;`;
  const movieArray = await db.all(getMoviesQuery);
  response.send(movieArray);
});

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { playerName, jerseyNumber, roll } = movieDetails;
  const addMoviesQuery = `
    INSERT INTO
      movie("directorId,"movieName","leadActor")
    VALUES
      (
        '${directorId}',
         ${movieName},
        '${leadActor}',
      );`;

  const dbResponse = await db.run(addMoviesQuery);
  const movieId = dbResponse.lastID;
  response.send("Movie Successfully Added");
});
