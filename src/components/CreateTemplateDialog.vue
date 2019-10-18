<template>
  <v-dialog
    v-model="dialogOpen"
    max-width="500"
  >
    <v-card>
      <v-card-title class="headline">Create Template</v-card-title>

      <ValidationObserver v-slot="{ valid }">
        <v-card-text>
          <div class="form-control">
            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              name="Name"
            >
              <label for="name">Name</label>
              <input type="text" placeholder="Team Name" name="name" v-model="formdata.name" required>
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div>
            <v-checkbox
              v-model="formdata.canHaveChildren"
              label="Can Have Children"
            ></v-checkbox>
          </div>
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
              @click="createTemplate"
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
    name: "create-template-dialog",
    props: {
      showDialog: Boolean,
      teamId: String
    },
    computed: {
      dialogOpen: {
        get () {
          return this.showDialog
        },
        set (newValue) {
          this.$emit('dialogToggled', newValue)
        }
      }
    },
    methods: {
      createTemplate () {
        console.log(this.formdata);
        var apiUrl = process.env.VUE_APP_API_URL + '/team/'+this.teamId+'/templates';
        this.$http.post(apiUrl, this.formdata).then(response => {
          if (response.status == 201) {
            this.$emit('templateCreated', response.body);
            this.dialogOpen = false;
          }
        })
      }
    },
    data () {
      return {
        formdata: {
          name: '',
          canHaveChildren: false
        }
      }
    }
  }
</script>
