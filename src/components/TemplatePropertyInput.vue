<template>
  <div class="template-property-input">
    <!-- The purpose of this component is to return the correct input field
        based on the property's fieldType
    -->
      <v-text-field
      v-model="propertyValue"
      :label="label"
      :placeholder="label"
      v-if="fieldType == 'string'"
      filled
      dense
      rounded

      background-color="#f7f9fc"
    ></v-text-field>
    <v-text-field
      v-model="propertyValue"
      :label="label"
      :placeholder="label"
      v-if="fieldType == 'number'"
      type="number"
      filled
      dense
      rounded
      background-color="#f7f9fc"
    >
    </v-text-field>
    <v-select
      v-if="fieldType == 'select'"
      v-model="propertyValue"
      :items="propertyOptions.options"

      :label="label"
      color="green darken-1"
      filled
      dense
      rounded
      background-color="#f7f9fc"
    ></v-select>
    <v-menu
      v-if="fieldType == 'date'"
      v-model="openMenus['date']"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="290px"

    >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="propertyValue"
          :label="label"
          prepend-icon="event"
          readonly
          v-on="on"
          filled
          dense
          rounded
          background-color="#f7f9fc"
        ></v-text-field>
      </template>
      <v-date-picker v-model="propertyValue" no-title scrollable>
        <v-spacer></v-spacer>
        <v-btn
          text
          color="primary"
          @click="openMenus['date'] = false"
        >OK</v-btn>
      </v-date-picker>
    </v-menu>
    <user-search-field
      v-if="fieldType == 'user'"
      v-model="propertyValue"
      :label ="label"
      :users="$store.state.common.activeTeamUsers"
    ></user-search-field>
  </div>
</template>

<script>
  import UserSearchField from './UserSearchField';
  require("../styles/TemplatePropertyInput.scss");

  export default {
    name: 'template-property-input',
    components: {
      UserSearchField
    },
    props: {
      fieldType: String,
      value: String,
      label: String,
      propertyOptions: Object
    },
    computed: {
      propertyValue: {
        get () {
          return this.value;
        },
        set (newValue) {
          this.$emit('input', newValue);
        }
      }
    },
    data () {
      return {
        openMenus: {}
      }
    }
  }
</script>
