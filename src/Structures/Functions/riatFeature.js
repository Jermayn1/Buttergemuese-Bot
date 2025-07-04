// Role Feature
async function giveRiatRole(client) {
    try {
        const riat = client.guilds.cache.get("596787251959037965").members.cache.get("1251534422885404718");
        const role = client.guilds.cache.get("596787251959037965").roles.cache.get("1390310066829263039");

        riat.roles.add(role.id);
    } catch(err) {
    }
}

module.exports = { giveRiatRole };