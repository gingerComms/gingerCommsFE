<template>
  <div id="teams-detail" class="template-content">
    <v-card
      flat
      >
      <v-card-title class="headline">
        <v-badge
          color="#55cec7"
          left
        >
          <template v-slot:badge>
            T
          </template>
          <div>{{ team.name }}</div>
        </v-badge>
      </v-card-title>

      <v-card-text>
        <v-tabs
          v-model="tab"
          background-color="#55cec7"
          centered
          dark
          icons-and-text
        >
          <v-tabs-slider></v-tabs-slider>

          <v-tab href="#details">
            Details
            <v-icon>mdi-pen</v-icon>
          </v-tab>

          <v-tab href="#templates">
            Templates
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-tab>

          <v-tab href="#members">
            Members
            <v-icon>mdi-account-group</v-icon>
          </v-tab>

          <v-tabs-items v-model="tab">
            <v-tab-item value="details">
              <v-card flat>
                  <team-edit
                    :team="team"
                    @teamEditted="teamEditted"
                  ></team-edit>
              </v-card>
            </v-tab-item>

            <v-tab-item value="templates">
              <v-card flat>
                <templates-list
                  :team="team"
                  :templates="team.templates"
                  @templateCreated="templateCreated"
                ></templates-list>
              </v-card>
            </v-tab-item>

            <v-tab-item value="members">
              <v-card flat>
                <v-card-text>
                  <members-list :nodeId="$route.params.teamId"></members-list>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  require("../styles/teams-detail.scss");

  import TemplatesList from "./TemplatesList";
  import MembersList from './MembersList';
  import TeamEdit from './TeamEdit';

  export default {
    name: 'teams-detail',
    components: {
      TemplatesList,
      MembersList,
      TeamEdit
    },
    props: [],
    methods: {
      getTeam () {
        var apiUrl = process.env.VUE_APP_API_URL + '/team/'+this.$route.params.teamId;
        this.$http.get(apiUrl).then(response => {
          if (response.status == 200) {
            this.team = response.body;
          }
        })
      },
      templateCreated (template) {
        this.team.templates.push(template)
      },
      teamEditted (team) {
        console.log("EDIT", team)
        this.team.name = team.name;
      }
    },
    data () {
      return {
        tab: null,
        team: {}
      }
    },
    created () {
      this.getTeam();
    }
  }
</script>