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
  VOverflowBtn,
  VBadge,
  VTabs,
  VTab,
  VTabsSlider,
  VTabItem,
  VTabsItems,
  VSelect,
  VEditDialog,
  VTextField,
  VCombobox
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
    VOverflowBtn,
    VBadge,
    VTabs,
    VTab,
    VTabsSlider,
    VTabItem,
    VTabsItems,
    VSelect,
    VEditDialog,
    VTextField,
    VCombobox
  }
})

const opts = {}

export default new Vuetify(opts)