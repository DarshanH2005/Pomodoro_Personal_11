const dns = require('dns');

const domain = '_mongodb._tcp.cluster0.ujsji9c.mongodb.net';

console.log(`Resolving SRV for ${domain}...`);

dns.resolveSrv(domain, (err, addresses) => {
  if (err) {
    console.error('SRV Lookup Failed:', err);
    // Try A record lookup for the base domain as fallback info
    dns.lookup('cluster0.ujsji9c.mongodb.net', (err2, address, family) => {
        if (err2) console.error('Base Domain Lookup Failed:', err2);
        else console.log('Base Domain Resolved:', address, 'Family:', family);
    });
  } else {
    console.log('SRV Records Found:', addresses);
  }
});
