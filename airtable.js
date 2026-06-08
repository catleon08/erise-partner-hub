const TABLES = {
  partners: "tblU4voEl0FjuMO2B",
  actions: "tbl5PojnUaDJYnY90",
  gaps: "tblRgiZSQWcATWdnT",
  milestones: "tblCJtmTIRjCYbdUl",
  thrusts: "tblcp7tex2cO2HxqC",
};

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const tableKey = url.searchParams.get("table");
  const sort = url.searchParams.get("sort") === "true";

  if (!tableKey || !TABLES[tableKey]) {
    return json({ error: "Invalid table request.", allowedTables: Object.keys(TABLES) }, 400);
  }

  if (!env.AIRTABLE_TOKEN || !env.AIRTABLE_BASE_ID) {
    return json({ error: "Missing AIRTABLE_TOKEN or AIRTABLE_BASE_ID in Cloudflare Pages variables." }, 500);
  }

  let airtableUrl = `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${TABLES[tableKey]}?pageSize=100`;
  if (sort) {
    airtableUrl += "&sort%5B0%5D%5Bfield%5D=Sort+Order&sort%5B0%5D%5Bdirection%5D=asc";
  }

  try {
    const response = await fetch(airtableUrl, {
      headers: {
        Authorization: `Bearer ${env.AIRTABLE_TOKEN}`,
        Accept: "application/json",
      },
    });

    const body = await response.text();

    if (!response.ok) {
      return json({ error: "Airtable request failed.", status: response.status, details: body.slice(0, 500) }, response.status);
    }

    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return json({ error: "Cloudflare Function failed.", details: error.message }, 500);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}
