const endpoint = 'https://apis.data.go.kr/B551011/KorService2/searchFestival2';
const day = 86400000;
const cacheDuration = 5 * 60 * 1000;
const districtPattern = /^\S+\s+(\S+시\s+\S+구|\S+[시군구])(?=\s|$)/;
const regionCodes = {
  '11':'11','26':'21','27':'22','28':'23','29':'24','30':'25','31':'26','36':'29',
  '41':'31','42':'32','51':'32','43':'33','44':'34','45':'35','52':'35','46':'36',
  '47':'37','48':'38','50':'39',
};
let cached;
let pending;

function formatDate(value, includeTime = false) {
  const text = String(value ?? '');
  if (!/^\d{8}(?:\d{6})?$/.test(text)) return '';
  const date = `${text.slice(0,4)}-${text.slice(4,6)}-${text.slice(6,8)}`;
  return includeTime && text.length === 14
    ? `${date} ${text.slice(8,10)}:${text.slice(10,12)}`
    : date;
}

function normalize(item) {
  const lat = Number(item.mapy);
  const lng = Number(item.mapx);
  const start = formatDate(item.eventstartdate);
  const end = formatDate(item.eventenddate);
  const name = String(item.title ?? '').trim();
  if (!name || !item.contentid || !start || !end || end < start ||
      !Number.isFinite(lat) || lat < 32 || lat > 40 ||
      !Number.isFinite(lng) || lng < 124 || lng > 133) return null;
  const address = [item.addr1, item.addr2].filter(Boolean).join(' ');
  return {
    id: `tourapi-${item.contentid}`, name, categories: ['기타 행사'], start, end,
    address, venue: item.addr1 || name, lat, lng,
    region: regionCodes[item.lDongRegnCd ?? item.ldongregncd] ?? '',
    district: address.match(districtPattern)?.[1] ?? '',
    price: null, age: null, setting: null, image: null, website: null,
    description: '', source: '한국관광공사 TourAPI',
    updatedAt: formatDate(item.modifiedtime, true), sample: false,
  };
}

async function loadEvents(key) {
  const today = new Intl.DateTimeFormat('sv-SE', {timeZone:'Asia/Seoul'}).format(new Date());
  const midnight = Date.parse(today + 'T00:00:00Z');
  const dateAt = offset => new Date(midnight + offset * day).toISOString().slice(0,10);
  const events = new Map();
  const pageSize = 100;
  const signal = AbortSignal.timeout(10000);
  for (let page = 1; page <= 25; page++) {
    const url = new URL(endpoint);
    url.search = new URLSearchParams({
      serviceKey:key, MobileOS:'WEB', MobileApp:'MOA', _type:'json', arrange:'Q',
      eventStartDate:dateAt(-90).replaceAll('-',''), eventEndDate:dateAt(90).replaceAll('-',''),
      numOfRows:String(pageSize), pageNo:String(page),
    }).toString();
    const response = await fetch(url, {signal});
    if (!response.ok) throw Error('TourAPI HTTP error');
    const {response: result} = await response.json();
    if (result?.header?.resultCode === '03') break;
    if (result?.header?.resultCode !== '0000' || !result.body) throw Error('TourAPI response error');
    const items = result.body.items?.item ?? [];
    for (const item of Array.isArray(items) ? items : [items]) {
      const event = normalize(item);
      if (event && event.end >= today && event.start <= dateAt(90)) events.set(event.id, event);
    }
    const total = Number(result.body.totalCount);
    if (!Number.isFinite(total)) throw Error('TourAPI pagination error');
    if (page * pageSize >= total) break;
    if (page === 25) throw Error('TourAPI pagination limit reached');
  }
  return {events:[...events.values()]};
}

export async function serveEvents(req, res, key) {
  function reply(status, body) {
    res.statusCode = status;
    res.setHeader('Content-Type','application/json; charset=utf-8');
    res.setHeader('Cache-Control','no-store');
    res.end(JSON.stringify(body));
  }
  if (req.method !== 'GET') {
    res.setHeader('Allow','GET');
    return reply(405,{error:'GET required'});
  }
  if (!key?.trim()) return reply(503,{error:'TOUR_API_KEY is not configured'});
  try {
    if (!cached || cached.expires <= Date.now()) {
      pending ??= loadEvents(key.trim())
        .then(data => { cached = {data,expires:Date.now()+cacheDuration}; })
        .finally(() => { pending = undefined; });
      await pending;
    }
    reply(200,cached.data);
  } catch {
    reply(502,{error:'TourAPI data is temporarily unavailable'});
  }
}

export default function handler(req, res) {
  return serveEvents(req, res, process.env.TOUR_API_KEY);
}
