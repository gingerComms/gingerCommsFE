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
    ></v-text-field>
    <v-text-field
      v-model="propertyValue"
      :label="label"
      :placeholder="label"
      v-if="fieldType == 'number'"
      type="number"
      filled
    >
    </v-text-field>
    <v-select
      v-if="fieldType == 'select'"
      v-model="propertyValue"
      :items="propertyOptions.options"
      filled
      :label="label"
      color="green darken-1"
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
  </div>
</template>

<script>
  export default {
    name: 'template-property-input',
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
