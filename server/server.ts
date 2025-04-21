import { Context, Hono } from "hono";
import { serve } from "@hono/node-server";
import pg from "pg";

const postgresql = new pg.Pool({
  user: "postgres",
});

const app = new Hono();
app.get("/", async (c: Context) => {
  return c.text("Hello World");
});
app.get("/Forelesning05/api/skoler", async (c: Context) => {
  const result = await postgresql.query(
    `select 
    skolenavn, 
    besoksadresse_besoksadresse_adressenavn as adresse,
    posisjon::json as coordinates
from grunnskoler_3697913259634315b061b324a3f2cf59.grunnskole`,
  );
  return c.json({
    type: "FeatureCollection",
    crs: {
      type: "name",
      properties: {
        name: "urn:ogc:def:crs:OGC:1.3:CRS84",
      },
    },
    features: result.rows.map(({ coordinates, ...properties }) => ({
      type: "Feature",
      properties,
      geometry: {
        type: "Point",
        coordinates,
      },
    })),
  });
});
serve(app);
