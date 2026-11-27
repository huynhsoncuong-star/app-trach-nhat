// Huyền Không Trạch Nhật — bộ nhớ đệm riêng, tiền tố 'trachnhat-'
const CACHE='trachnhat-v165-20261127', PFX='trachnhat-';
const CORE=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-180.png'];
self.addEventListener('install',e=>{self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE).catch(()=>{})));});
// CHỈ xoá bộ nhớ đệm CŨ CỦA CHÍNH APP NÀY — không đụng app khác cùng tên miền
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(
  ks.filter(k=>k.indexOf(PFX)===0&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  // khác nguồn (máy chủ cấp quyền, bản đồ, thư viện…) hoặc có tham số: đi thẳng mạng, KHÔNG lưu
  if(u.origin!==self.location.origin||u.search||/hieu-luc\.json$/.test(u.pathname))return;
  e.respondWith(caches.match(e.request).then(h=>{
    const n=fetch(e.request).then(r=>{if(r&&r.status===200&&r.type==='basic'){
      const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));}return r;}).catch(()=>h);
    return h||n;}));});
