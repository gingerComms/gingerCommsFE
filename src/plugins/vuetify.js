// Material Icons
import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue'
// Automatically imports all of the styles and components as they're needed
import Vuetify, {
  VCard,
  VTooltip,
  VBtn,
  VContainer,
  VRadio,
  VRadioGroup,
  VDialog,
  VCardTitle,
  VCardText,
  VCardActions,
  VRow,
  VSpacer,
  VIcon,
  VSkeletonLoader,
  VList,
  VListItem,
  VListItemTitle,
  VMenu,
  VDataTable,
  VCheckbox,
  VOverflowBtn
} from 'vuetify/lib'

Vue.use(Vuetify, {
  components: {
    VCard,
    VTooltip,
    VBtn,
    VIcon,
    VDialog,
    VContainer,
    VRadio,
    VRadioGroup,
    VCardTitle,
    VCardText,
    VCardActions,
    VRow,
    VSpacer,
    VSkeletonLoader,
    VList,
    VMenu,
    VListItem,
    VListItemTitle,
    VDataTable,
    VCheckbox,
    VOverflowBtn
  }
})

const opts = {}

export default new Vuetify(opts)