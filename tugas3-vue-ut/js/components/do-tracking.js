Vue.component('do-tracking',{
  template: `
  <div>
    <form class="tracking-form" @submit.prevent="lacakDO">
      <input v-model.trim="query" type="text" placeholder="Nomor DO atau NIM (Enter untuk cari)">
      <button type="submit">Lacak</button>
    </form>
    <small class="example-text">Contoh: DO2025-0001</small>

    <div v-if="error" class="error">{{error}}</div>

    <div v-if="result" class="card-tracking">
  <h3>{{result.nama}} — {{result.nim}}</h3>

  <div class="field">
    <strong>Status</strong>
    <span>{{result.status}}</span>
  </div>

  <div class="field">
    <strong>Ekspedisi</strong>
    <span>{{result.ekspedisi}}</span>
  </div>

  <div class="field">
    <strong>Tanggal Kirim</strong>
    <span>{{formatDate(result.tanggalKirim)}}</span>
  </div>

  <div class="field">
    <strong>Paket</strong>
    <span>{{result.paket}}</span>
  </div>

  <div class="field">
    <strong>Total</strong>
    <span>Rp {{formatNumber(result.total)}}</span>
  </div>

  <h4>Perjalanan</h4>
  <ul>
    <li v-for="(p,i) in result.perjalanan" :key="i">
      <strong>{{p.waktu}}</strong> — {{p.keterangan}}
    </li>
  </ul>
</div>


    <hr>

    <h3>Tambah DO Baru</h3>
    <div class="card form-new">
      <label>Nomor DO</label><input :value="autoDO" readonly class="full"/>
      <label>NIM</label><input v-model.trim="form.nim" />
      <label>Nama</label><input v-model.trim="form.nama" />
      <label>Ekspedisi</label>
      <select v-model="form.ekspedisi">
      <option disabled value="">Pilih</option>
      <option v-for="e in pengirimanList" :key="e.kode" :value="e.nama">{{e.nama}}</option></select>
      <label>Paket</label><select v-model="form.paket">
      <option disabled value="">Pilih</option>
      <option v-for="p in paketList" :key="p.kode" :value="p.kode">{{p.kode}} — {{p.nama}}</option></select>
      <div v-if="paketSelected" class="paket-detail full">
        <p><strong>Isi:</strong></p><ul><li v-for="i in paketSelected.isi">{{i}}</li></ul>
        <p><strong>Harga:</strong> Rp {{formatNumber(paketSelected.harga)}}</p>
      </div>
      <label>Tanggal Kirim</label><input type="date" v-model="form.tanggalKirim"/>
      <label>Catatan awal (opsional)</label><input v-model="form.catatan"/>
      <button class="btn-save full" @click="saveDO">Simpan DO</button>
    </div>
  </div>
  `,
  data(){ return {
    dataAll:null, query:'', result:null, error:'', form:{nim:'',nama:'',ekspedisi:'',paket:'',tanggalKirim:'',catatan:''}, stored:{}}
  },
  computed:{
    paketList(){
      return this.dataAll ? this.dataAll.paket : []
    },
    pengirimanList(){
      return this.dataAll ? this.dataAll.pengirimanList : []
    },
    paketSelected(){
      return this.paketList.find(p=>p.kode===this.form.paket)
    },
    autoDO(){
      const y=new Date().getFullYear();
      const k=Object.keys(this.combinedTracking()).filter(x=>x.startsWith('DO'+y));
      return `DO${y}-${String(k.length+1).padStart(4,'0')}`
    }
  },
  methods:{
    async load(){
      this.dataAll = await api.loadData();
      this.stored = JSON.parse(localStorage.getItem('sitta_tracking')||'{}');
    },
    combinedTracking(){
      return Object.assign({},
        this.dataAll ?(
          this.dataAll.tracking||{}) : {}, this.stored||{} );
        },
    formatNumber(n){
      return Number(n||0).toLocaleString('id-ID');
    },
    formatDate(d){
      if(!d) return '';
      const dt=new Date(d);
      if(isNaN(dt)) return d;
      return dt.toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'});
    },
    lacakDO(){
      this.error='';
      this.result=null;
      const q=(this.query||'').trim();
      if(!q){ this.error='Masukkan Nomor DO atau NIM';
        return; } const all=this.combinedTracking();
        if(all[q]){ this.result=all[q]; return;
        }
      const found = Object.values(all).find(x=>x.nim===q);
      if(found){
        this.result=found; return; }
        this.error='Data tidak ditemukan';
      },
    saveDO(){
      if(!this.form.nim||!this.form.nama||!this.form.paket){ alert('Isi NIM, Nama dan Paket');
        return; } const nomor=this.autoDO;
        const paket=this.paketSelected||{kode:this.form.paket,harga:0};
        const entry={
          nim:this.form.nim,
          nama:this.form.nama, 
        status:'Baru Dibuat', 
      ekspedisi:this.form.ekspedisi||'',
      paket:paket.kode, total:paket.harga||0,
      tanggalKirim:this.form.tanggalKirim||new Date().toISOString().slice(0,10),
      perjalanan:[{ waktu:new Date().toLocaleString(),
        keterangan:this.form.catatan||'DO dibuat' }]};
        this.stored[nomor]=entry; localStorage.setItem('sitta_tracking',
          JSON.stringify(this.stored)); alert('DO tersimpan: '+nomor);
          this.form={nim:'',nama:'',ekspedisi:'',paket:'',tanggalKirim:'',catatan:''};
        }
  },
  async mounted(){
    await this.load(); }
});
