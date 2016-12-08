'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const civ6 = require('../index.js');

describe('Modify Cathy Save', function() {
  let buffer = new Buffer(fs.readFileSync('test/saves/CATHERINE DE MEDICI 1 4000 BC.Civ6Save'));
  const data = civ6.parse(buffer);

  it('should be able to change a player names in any order', () => {
    civ6.modifyChunk(data.chunks, data.parsed.CIVS[0].data.PLAYER_NAME, 'Mike Rosack 0');
    civ6.modifyChunk(data.chunks, data.parsed.CIVS[2].data.PLAYER_NAME, 'Mike Rosack 2');
    civ6.modifyChunk(data.chunks, data.parsed.CIVS[1].data.PLAYER_NAME, 'Mike Rosack 1');
    buffer = Buffer.concat(data.chunks);
    //fs.writeFileSync('test/saves/modified.Civ6Save', buffer);

    const reparse = civ6.parse(buffer).parsed;

    expect(reparse.CIVS[0].data.PLAYER_NAME.data).to.equal('Mike Rosack 0');
    expect(reparse.CIVS[1].data.PLAYER_NAME.data).to.equal('Mike Rosack 1');
    expect(reparse.CIVS[2].data.PLAYER_NAME.data).to.equal('Mike Rosack 2');
  });

  it('should be able to change a human player to AI', () => {
    civ6.modifyChunk(data.chunks, data.parsed.CIVS[0].data.ACTOR_AI_HUMAN, 1);
    buffer = Buffer.concat(data.chunks);
    fs.writeFileSync('test/saves/modified.Civ6Save', buffer);

    const reparse = civ6.parse(buffer).parsed;

    expect(reparse.CIVS[0].data.ACTOR_AI_HUMAN.data).to.equal(1);
  });
});