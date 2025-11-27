// simple order form component for order.html
Vue.component('order-form',{
  template: `
    <div class="order-card">
      <div v-if="loading">Memuat...</div>
      <div v-else>
        <label>Pilih Paket</label>
        <select v-model="selected">
          <option disabled value="">-- Pilih Paket --</option>
          <option v-for="p in paket" :key="p.kode" :value="p.kode">{{p.kode}} — {{p.nama}}</option>
        </select>

        <div v-if="paketObj" style="margin:10px 0;padding:10px;border-radius:8px;background:#fbfdff;">
          <p><strong>Isi Paket:</strong></p>
          <ul><li v-for="i in paketObj.isi">{{i}}</li></ul>
          <p><strong>Harga:</strong> Rp {{formatNumber(paketObj.harga)}}</p>
        </div>

        <label>Jumlah</label><input type="number" v-model.number="qty" min="1"/>
        <label>Nama Pemesan</label><input v-model.trim="buyer" />
        <label>Alamat</label><input v-model.trim="alamat" />

        <button class="btn-order" @click="doOrder">Pesan Sekarang</button>
      </div>
    </div>
  `,
  data(){ return { loading:true, paket:[], selected:'', qty:1, buyer:'', alamat:'' } },
  computed:{ paketObj(){ return this.paket.find(p=>p.kode===this.selected) }},
  methods:{
    async load(){ const data = await api.loadData(); this.paket = data.paket || []; this.loading=false; },
    formatNumber(n){ return Number(n||0).toLocaleString('id-ID'); },
    doOrder(){ if(!this.selected||!this.buyer||!this.alamat){ alert('Isi semua field'); return; } alert('Order berhasil (mock): '+this.selected+' x'+this.qty); this.qty=1; this.buyer=''; this.alamat=''; this.selected=''; }
  },
  async mounted(){ await this.load(); }
});
