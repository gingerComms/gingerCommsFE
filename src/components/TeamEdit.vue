<template>
  <div id="team-edit">
    <ValidationObserver v-slot="{ valid }">
      <v-card-text>
          <div class="form-control">
            <ValidationProvider
              rules="required"
              v-slot="{ errors }"
              name="Name"
            >
              <label for="name">Name</label>
              <input type="text" :placeholder="team.name" name="name" v-model="formdata.name" required>
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
            @click="editTeam"
          >Save</v-btn>
        </div>
      </v-card-actions>
    </ValidationObserver>
  </div>
</template>

<script>
  export default {
    name: 'team-edit',
    props: {
      "team": Object
    },
    methods: {
      editTeam () {
        var apiUrl = process.env.VUE_APP_API_URL + '/team/'+this.team.id;
        this.$http.put(apiUrl, this.formdata).then(response => {
          if (response.status == 200) {
            this.$emit("teamEditted", response.body);
          }
        })
      },
      resetForm () {
        Object.assign(this.formdata, this.team);
      }
    },
    data () {
      return {
        formdata: {
          name: ''
        }
      }
    },
    created () {
      this.formdata.name = this.team.name;
    }
  }
</script>
