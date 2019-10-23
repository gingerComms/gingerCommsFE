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
      fieldTypes: Array
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
        this.formdata.value = this.valuefyProperty(this.formdata.name);
        this.$http.post(apiUrl, this.formdata).then(response => {
          if (response.status == 201) {
            this.$emit('propertyAdded', response.body);
            this.$emit('dialogToggled', false);
            this.formdata = {
              name: '',
              fieldType: 'string',
              value: ''
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
          value: ''
        },
      }
    }
  }
</script>
