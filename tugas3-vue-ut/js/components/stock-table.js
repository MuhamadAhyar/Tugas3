Vue.component('stock-table',{
  props:['stok','upbjjList','kategoriList'],
  data(){ return {
    filterUpbjj:'', filterKategori:'', filterStatus:'', sortBy:'',
    modalTambah:false, modalEdit:false, formEdit:{}, formTambah:{
      kode:'',judul:'',kategori:'',upbjj:'',lokasiRak:'',harga:0,qty:0,safety:0,catatanHTML:''
    }
  }},
  computed:{
    kategoriByUpbjj(){
      if(!this.filterUpbjj) return [...new Set(this.kategoriList)].sort();
      return [...new Set(this.stok.filter(s=>s.upbjj===this.filterUpbjj).map(s=>s.kategori))].sort();
    },
    filtered(){
      let arr = (this.stok||[]).slice();
      if(this.filterUpbjj) arr = arr.filter(i=>i.upbjj===this.filterUpbjj);
      if(this.filterKategori) arr = arr.filter(i=>i.kategori===this.filterKategori);
      if(this.filterStatus==='low') arr = arr.filter(i=>Number(i.qty) < Number(i.safety) && Number(i.qty)>0);
      if(this.filterStatus==='empty') arr = arr.filter(i=>Number(i.qty)===0);
      if(this.sortBy==='judul') arr.sort((a,b)=>(a.judul||'').localeCompare(b.judul||''));
      if(this.sortBy==='harga') arr.sort((a,b)=>(Number(a.harga)||0)-(Number(b.harga)||0));
      if(this.sortBy==='qty') arr.sort((a,b)=>(Number(a.qty)||0)-(Number(b.qty)||0));
      return arr;
    }
  },
  methods:{
    reset(){
      this.filterUpbjj='';
      this.filterKategori='';
      this.filterStatus='';
      this.sortBy='';
    },
    openEdit(it){
      this.formEdit = Object.assign({}, it);
      this.modalEdit=true;
    },
    saveEdit(){
      const idx = this.stok.findIndex(x=>x.kode===this.formEdit.kode);
      if(idx>=0) Vue.set(this.stok, idx, Object.assign({}, this.formEdit));
      this.modalEdit=false;
    },
    openTambah(){
      this.modalTambah=true;
    },
    saveTambah(){
      if(!this.formTambah.kode||!this.formTambah.judul||!this.formTambah.upbjj){alert('Kode, Judul, UPBJJ wajib');
        return;
      } if(this.stok.find(x=>x.kode===this.formTambah.kode)){ alert('Kode sudah ada');
        return; } this.stok.push(Object.assign({}, this.formTambah));
        this.formTambah={kode:'',judul:'',kategori:'',upbjj:'',lokasiRak:'',harga:0,qty:0,safety:0,catatanHTML:''};
        this.modalTambah=false;
      },
    askDelete(it){
      if(confirm('Hapus '+it.kode+' ?')){ const idx=this.stok.indexOf(it);
        if(idx>=0) this.stok.splice(idx,1);
      }
    }
  },
  template: `
  <div>
    <div class="filter-row">
      <div><label>UPBJJ</label><br/>
      <select v-model="filterUpbjj"><option value="">Semua</option>
      <option v-for="u in upbjjList" :key="u" :value="u">{{u}}</option></select></div>
      <div v-if="filterUpbjj"><label>Kategori</label><br/><select v-model="filterKategori">
      <option value="">Semua</option><option v-for="k in kategoriByUpbjj" :key="k" :value="k">{{k}}</option></select></div>
      <div><label>Status</label><br/><select v-model="filterStatus">
      <option value="">Semua</option><option value="low">Stok &lt; Safety</option><option value="empty">Stok = 0</option></select></div>
      <div><label>Sort</label><br/><select v-model="sortBy"><option value="">Default</option>
      <option value="judul">Judul</option><option value="harga">Harga</option><option value="qty">Stok</option></select></div>
      <div class="button-group"><button class="btn-add" @click="openTambah">+ Tambah</button>
      <button class="btn-reset" @click="reset">Reset</button><a class="btn-back" href="index.html">Back</a></div>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
        <tr>
        <th>Kode</th>
        <th>Judul</th>
        <th>Kategori</th>
        <th>UPBJJ</th>
        <th>Lokasi</th>
        <th>Harga</th>
        <th>Stok</th>
        <th>Safety</th>
        <th>Status</th>
        <th>Aksi</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="it in filtered" :key="it.kode">
            <td>{{it.kode}}</td>
            <td v-html="it.judul"></td>
            <td>{{it.kategori}}</td>
            <td>{{it.upbjj}}</td>
            <td>{{it.lokasiRak}}</td>
            <td>Rp {{ Number(it.harga).toLocaleString() }}</td>
            <td>{{it.qty}} buah</td>
            <td>{{it.safety}} buah</td>
            <td><status-badge :item="it"></status-badge></td>
            <td><button class="btn-edit" @click="openEdit(it)">Edit</button>
            <button class="btn-delete" @click="askDelete(it)">Hapus</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <app-modal :show="modalTambah" @close="modalTambah=false">
      <div class="modal-card">
        <h3>Tambah Bahan Ajar</h3>
        <div class="form-grid">
          <label>Kode</label><input v-model="formTambah.kode"/>
          <label>Judul</label><input v-model="formTambah.judul"/>
          <label>Kategori</label><input v-model="formTambah.kategori"/>
          <label>UPBJJ</label><input v-model="formTambah.upbjj"/>
          <label>Lokasi Rak</label><input v-model="formTambah.lokasiRak"/>
          <label>Harga</label><input type="number" v-model.number="formTambah.harga"/>
          <label>Stok</label><input type="number" v-model.number="formTambah.qty"/>
          <label>Safety</label><input type="number" v-model.number="formTambah.safety"/>
          <label>Catatan</label><textarea v-model="formTambah.catatanHTML"></textarea>
        </div>
        <div class="modal-actions"><button class="btn-save" @click="saveTambah">Tambah</button></div>
      </div>
    </app-modal>

    <app-modal :show="modalEdit" @close="modalEdit=false">
      <div class="modal-card">
        <h3>Edit Bahan Ajar</h3>
        <div class="form-grid">
          <label>Kode</label><input v-model="formEdit.kode" readonly/>
          <label>Judul</label><input v-model="formEdit.judul"/>
          <label>Qty</label><input type="number" v-model.number="formEdit.qty"/>
          <label>Safety</label><input type="number" v-model.number="formEdit.safety"/>
          <label>Catatan</label><textarea v-model="formEdit.catatanHTML"></textarea>
        </div>
        <div class="modal-actions"><button class="btn-save" @click="saveEdit">Simpan</button></div>
      </div>
    </app-modal>

  </div>
  `
});
