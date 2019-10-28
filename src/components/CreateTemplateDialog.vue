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
              <input type="text" placeholder="Template Name" name="name" v-model="formdata.name" required>
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div>
            <v-menu
              v-model="openMenus['pillFg']"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="formdata.pillForegroundColor"
                  label="Pill Foreground Color"
                  prepend-icon="mdi-format-color-fill"
                  readonly
                  v-on="on"
                  backgroundColor="#f7f9fc"
                  filled
                ></v-text-field>
              </template>
              <v-color-picker v-model="formdata.pillForegroundColor"></v-color-picker>
            </v-menu>
            <v-menu
              v-model="openMenus['pillBg']"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="formdata.pillBackgroundColor"
                  label="Pill Background Color"
                  prepend-icon="mdi-format-color-fill"
                  readonly
                  v-on="on"
                  backgroundColor="#f7f9fc"
                  filled
                ></v-text-field>
              </template>
              <v-color-picker v-model="formdata.pillBackgroundColor"></v-color-picker>
            </v-menu>
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
            this.formdata = {
              canHaveChildren: false, name: '', pillBackgroundColor: '#55CEC7', pillForegroundColor: '#FFFFFFFF'
            };
          }
        }, response => {
          this.$store.commit('common/errorUpdate', { message: response.statusText, show: true });
          this.formdata = {
            canHaveChildren: false, name: '', pillBackgroundColor: '#55CEC7', pillForegroundColor: '#FFFFFFFF'
          };
        })
      }
    },
    data () {
      return {
        formdata: {
          name: '',
          canHaveChildren: false,
          pillBackgroundColor: '#55CEC7',
          pillForegroundColor: '#FFFFFFFF'
        },
        openMenus: {}
      }
    }
  }
</script>
