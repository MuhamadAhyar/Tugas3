// js/services/api.js
const api = (function(){
  // Adjust this path when running locally: use "data/dataBahanAjar.json"
  const DEFAULT_URL = "/data/dataBahanAjar.json";

  async function loadData(url = DEFAULT_URL){
    const res = await fetch(url);
    if(!res.ok) throw new Error('HTTP '+res.status);
    const json = await res.json();
    // Ensure keys exist
    json.stok = json.stok || json.stokData || [];
    json.tracking = json.tracking || {};
    json.paket = json.paket || json.paketList || [];
    json.pengirimanList = json.pengirimanList || json.pengiriman || [
      { kode:'REG', nama:'JNE Regular' },
      { kode:'EXP', nama:'JNE Express' }
    ];
    json.upbjjList = json.upbjjList || [];
    json.kategoriList = json.kategoriList || [];
    return json;
  }

  return { loadData };
})();
