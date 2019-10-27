// Material Icons
import '@mdi/font/css/materialdesignicons.css'
import Vue from 'vue'
// Wysiwyg editor plugin
import { TiptapVuetifyPlugin } from 'tiptap-vuetify'
import 'tiptap-vuetify/dist/main.css'
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
  VCombobox,
  VDatePicker,
  VChip,
  VCol
} from 'vuetify/lib'

const vuetify = new Vuetify()

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
    VCombobox,
    VDatePicker,
    VChip,
    VCol
  }
})

Vue.use(TiptapVuetifyPlugin, {
  // the next line is important! You need to provide the Vuetify Object to this place.
  vuetify, // same as "vuetify: vuetify"
  // optional, default to 'md' (default vuetify icons before v2.0.0)
  iconsGroup: 'mdi'
})

const opts = {}

export default new Vuetify(opts)