<template>
  <v-dialog
    v-model="dialogOpen"
    max-width="500"
    id="create-template-property-dialog"
  >
    <v-card>
      <v-card-title class="headline">Create Template Property</v-card-title>

      <ValidationObserver v-slot="{ valid }">
        <v-card-text>
          <div class="form-control">
            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              name="Name"
            >
              <input type="text" placeholder="Template Name" name="name" v-model="formdata.name" required>
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>

          <v-select
            v-model="formdata.fieldType"
            :items="fieldTypes"
            item-text="text"
            item-value="value"
            filled
            label="Field Type"
            single-line
            background-color="#f7f9fc"
            color="green darken-1"
          ></v-select>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="dialogOpen=false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            v-on:click="createTemplateProperty"
            :disabled="!valid"
          >
            Create
          </v-btn>
        </v-card-actions>
      </ValidationObserver>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'create-template-property-dialog',
    props: {
      templateId: String,
      showDialog: Boolean,
      fieldTypes: Array,
      templateProperties: Array
    },
    computed: {
      dialogOpen: {
        get () {
          return this.showDialog;
        },
        set (newValue) {
          this.$emit('dialogToggled', newValue);
        }
      }
    },
    methods: {
      createTemplateProperty () {
        var apiUrl = process.env.VUE_APP_API_URL;
        apiUrl += '/team/'+this.$route.params.teamId+'/templates/'+this.templateId+'/properties';
        // Changed so that the property.value is the property ID
        // this.formdata.value = this.valuefyProperty(this.formdata.name);
        this.formdata.propertyOptions = this.fieldTypeToPropertyOptions[this.formdata.fieldType];
        this.formdata.index = this.templateProperties.length;

        console.log('New Property')
        this.$http.post(apiUrl, this.formdata).then(response => {
          if (response.status == 201) {
            var property = response.body;
            property.propertyOptions = JSON.parse(property.propertyOptions);
            this.$emit('propertyAdded', property);
            this.$emit('dialogToggled', false);
            this.formdata = {
              name: '',
              fieldType: 'string',
              index: this.templateProperties.length,
              propertyOptions: '{}'
            };
          }
        })
      }
    },
    data () {
      return {
        formdata: {
          name: '',
          fieldType: 'string',
          index: '',
          propertyOptions: '{}' // This gets a default value based on the fieldType
        },
        fieldTypeToPropertyOptions: {
          'string': '{}',
          'number': '{}',
          'select': '{"options": []}',
          'date': '{}',
          'user': '{}',
          'file': '{}'
        }
      }
    }
  }
</script>
