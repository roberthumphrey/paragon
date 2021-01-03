const Event = require('../../Structures/Event');

module.exports = class extends Event {
    async run(member) {
        console.log(member.id);
    }
}