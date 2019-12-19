<template>
  <div id="teams-detail" class="template-content">
    <v-card
      
      >
      <v-card-title class="headline">
        <v-row>
          <v-col cols="6" xs="12">
            {{ team.name }}
          </v-col>
          <v-col cols="6" xs="12" class="text-lg-right">
            <v-chip
              color="black"
              small
              style="color: white"
            >Team</v-chip>
          </v-col>
        <v-badge
          color="#55cec7"
          left
        >
          <!-- <template v-slot:badge>
            T
          </template> -->
        </v-badge>
        </v-row>
      </v-card-title>

      <v-card-text>
        <v-tabs
          v-model="tab"
          background-color="transparent"
          color="#55cec7"
          left
          flat
          icons-and-text
        >
          <v-tabs-slider></v-tabs-slider>
          <v-tab href="#templates">
            Templates
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-tab>

          <v-tab href="#details">
            Details
            <v-icon>mdi-pen</v-icon>
          </v-tab>

          <v-tab href="#nodes-tree">
            Tree View
            <v-icon>mdi-format-list-bulleted</v-icon>
          </v-tab>

          <v-tab href="#members">
            Members
            <v-icon>mdi-account-group</v-icon>
          </v-tab>

          <v-tabs-items v-model="tab">
            <v-tab-item value="templates">
              <v-card flat>
                <templates-list
                  :team="team"
                  :templates="team.templates"
                  @templateCreated="templateCreated"
                ></templates-list>
              </v-card>
            </v-tab-item>

            <v-tab-item value="details">
              <v-card flat>
                  <team-edit
                    :team="team"
                    @teamEditted="teamEditted"
                  ></team-edit>
              </v-card>
            </v-tab-item>

            <v-tab-item value="nodes-tree">
              <nodes-tree-view
                :parentNodeType="'team'"
                :parentNodeId="team.id"
                :parentCanHaveChildren="true"
              ></nodes-tree-view>
            </v-tab-item>

            <v-tab-item value="members">
              <assignees-list
                :nodeId="$route.params.teamId"
                :nodeType="'team'"
              ></assignees-list>
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
  import TeamEdit from './TeamEdit';
  import NodesTreeView from './NodesTreeView';
  import AssigneesList from './AssigneesList';

  export default {
    name: 'teams-detail',
    components: {
      TemplatesList,
      TeamEdit,
      AssigneesList,
      NodesTreeView
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
