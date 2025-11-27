Vue.component('status-badge',{
  props:['item'],
  computed:{
    state(){
      const qty = Number(this.item.qty||0), safety = Number(this.item.safety||0);
      if(qty===0) return { cls:'status-zero', text:'Kosong', icon:'⛔' };
      if(qty < safety) return { cls:'status-low', text:'Menipis', icon:'⚠' };
      return { cls:'status-aman', text:'Aman', icon:'✔' };
    }
  },
  template:`<span :class="state.cls" :title="item.catatanHTML || item.catatan || ''">{{state.icon}} {{state.text}}</span>`
});
