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
    skolenavn, fylke.fylkesnummer, st_transform(posisjon, 4326)::json as geometry    
    from grunnskoler_3697913259634315b061b324a3f2cf59.grunnskole
        inner join fylker_ba7aea2735714391a98b1a585644e98a.fylke on st_contains(omrade, posisjon)
    where fylke.objid in (select fylke_fk
                          from fylker_ba7aea2735714391a98b1a585644e98a.administrativenhetnavn where navn = 'Viken')
    `,
  );
  return c.json({
    type: "FeatureCollection",
    crs: {
      type: "name",
      properties: {
        name: "urn:ogc:def:crs:OGC:1.3:CRS84",
      },
    },
    features: result.rows.map(
      ({ geometry: { coordinates }, ...properties }) => ({
        type: "Feature",
        properties,
        geometry: {
          type: "Point",
          coordinates,
        },
      }),
    ),
  });
});
serve(app);
