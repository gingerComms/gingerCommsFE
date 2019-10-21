<template>
  <div id="template-edit">
    <v-card
      flat
    >
      <ValidationObserver v-slot="{ valid }">
        <v-card-text>
          <div class="form-control">
            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              name="Name"
            >
              <label for="name">Name</label>
              <input type="text" :placeholder="template.name" name="name" v-model="formdata.name" required>
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
        </v-card-text>

        <v-card-actions>
          <div class="ma-auto">
            <v-btn
              color="red"
              @click="resetForm"
            >Reset</v-btn>

            <v-btn
              color="#55cec7"
              :disabled="!valid"
              @click="editTemplate"
            >Save</v-btn>
          </div>
        </v-card-actions>
      </ValidationObserver>
    </v-card>
  </div>
</template>

<script>
  export default {
    name: 'template-edit',
    props: {
      template: Object
    },
    methods: {
      resetForm () {
        Object.assign(this.formdata, this.template)
      },
      editTemplate () {
        var apiUrl = process.env.VUE_APP_API_URL;
        apiUrl += '/team/'+this.$route.params.teamId+'/templates/'+this.template.id;
        this.$http.put(apiUrl, this.formdata).then(response => {
          if (response.status == 200) {
            this.$emit('templateEditted', response.body);
          }
        })
      }
    },
    data () {
      return {
        formdata: {}
      }
    },
    created () {
      this.formdata.name = this.template.name;
    }
  }
</script>
