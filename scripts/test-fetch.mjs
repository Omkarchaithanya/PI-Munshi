async function test() {
  const res = await fetch('http://localhost:8080/');
  console.log('GET / -> Status:', res.status);
  const html = await res.text();
  console.log('HTML Length:', html.length);
  const scripts = [...html.matchAll(/src="([^"]+)"/g)].map(m => m[1]);
  console.log('Scripts to load:', scripts);
  for (const s of scripts) {
    const url = s.startsWith('http') ? s : 'http://localhost:8080' + s;
    const r = await fetch(url);
    console.log(`Script ${s} -> ${r.status} (${r.headers.get('content-type')})`);
  }
}
test().catch(console.error);

