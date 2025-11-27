Vue.component('app-modal',{
  props:['show'],
  methods:{ close(){
    this.$emit('close');
  }
},
  template: `
    <div v-if="show" class="modal-overlay" @keydown.esc="$emit('close')" tabindex="0">
      <div class="modal-card" @click.stop>
        <slot></slot>
      </div>
    </div>
  `
});
