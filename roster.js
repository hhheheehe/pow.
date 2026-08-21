const { Redis } = require("@upstash/redis");

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  const auth = req.headers.authorization;

  if (auth !== `Bearer ${process.env.ROSTER_API_SECRET}`) {
    return res.status(401).json({
      error: "Unauthorized"
    });
  }

  let roster = await redis.get("powpow_roster");

  if (!roster) {
    roster = {
      groups: [],
      permissions: []
    };
  }

  if (req.method === "GET") {
    return res.status(200).json(roster);
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const body = req.body;

  if (body.action === "add") {
    roster.groups ||= [];

    let group = roster.groups.find(
      g => g.name.toLowerCase() === body.role.toLowerCase()
    );

    if (!group) {
      group = {
        name: body.role,
        people: []
      };

      roster.groups.push(group);
    }

    group.people.push({
      name: body.name,
      description: body.description,
      pfp: body.pfp || ""
    });
  }

  if (body.action === "remove") {
    for (const group of roster.groups || []) {
      group.people = (group.people || []).filter(
        p => p.name.toLowerCase() !== body.name.toLowerCase()
      );
    }
  }

  if (body.action === "update") {
    for (const group of roster.groups || []) {
      const person = (group.people || []).find(
        p => p.name.toLowerCase() === body.name.toLowerCase()
      );

      if (person) {
        if (body.newName) person.name = body.newName;
        if (body.description) person.description = body.description;
        if (body.pfp) person.pfp = body.pfp;

        if (body.role && body.role !== group.name) {
          person._newRole = body.role;
        }
      }
    }

    for (const group of roster.groups || []) {
      group.people = group.people.filter(p => {
        if (p._newRole) {
          let newGroup = roster.groups.find(
            g => g.name.toLowerCase() === p._newRole.toLowerCase()
          );

          if (!newGroup) {
            newGroup = {
              name: p._newRole,
              people: []
            };

            roster.groups.push(newGroup);
          }

          delete p._newRole;
          newGroup.people.push(p);
          return false;
        }

        return true;
      });
    }
  }

  if (body.action === "giveperm") {
    roster.permissions ||= [];

    if (!roster.permissions.includes(body.userId)) {
      roster.permissions.push(body.userId);
    }
  }

  if (body.action === "removeperm") {
    roster.permissions = (roster.permissions || [])
      .filter(id => id !== body.userId);
  }

  await redis.set("powpow_roster", roster);

  return res.status(200).json({
    success: true,
    roster
  });
}
