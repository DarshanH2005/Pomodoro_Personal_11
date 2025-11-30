const dns = require('dns');

const shard = 'cluster0-shard-00-00.ujsji9c.mongodb.net';

console.log(`Resolving A record for ${shard}...`);

dns.lookup(shard, (err, address, family) => {
  if (err) {
    console.error('Shard Lookup Failed:', err);
  } else {
    console.log('Shard Resolved:', address, 'Family:', family);
  }
});
