<template>
  <div id="dashboard" class="template-content">
    <div class="row mb-1 mt-1 header-row">
      <div class="col-3">
        <v-tooltip bottom nudge-left="45">
          <template class="create-team-button" v-slot:activator="{ on }">
            <div class="create-team-button" v-on="on" @click.stop="createTeamDialog=true">
              <h2>Teams</h2>
            </div>
          </template>
          <span>Create Team</span>
        </v-tooltip>
      </div>
    </div>
    <div class="row">
      <div class="col-5 display-switch">
        <v-overflow-btn
          :items="listTabOptions"
          label="Display Mode"
          segmented
          v-model="containerDisplayMode"
        ></v-overflow-btn>
      </div>
    </div>

    <ListTabView :isLoading="isLoading" :mode="containerDisplayMode" :headers="teamsListHeaders" :objects="listTabViewFormattedData">
      <template v-slot:tabUtils="slotProps">
        <!-- A V-Menu component is used to display the utils in tabs -->
        <v-list>
          <v-list-item @click="deleteTeam(slotProps.team.id)">
            <v-list-item-title>Delete</v-list-item-title>
          </v-list-item>
        </v-list>
      </template>

      <template v-slot:listUtils="slotProps">
        <v-btn
          icon
          @click="deleteTeam(slotProps.team.id)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </ListTabView>

    <CreateTeamDialog
      :showDialog="createTeamDialog"
      @dialogToggled="createTeamDialog=false"
      @teamCreated="teamCreated"
    ></CreateTeamDialog>

  </div>
</template>

<script>
  import ListTabView from '@/components/ListTabView';
  import CreateTeamDialog from '@/components/CreateTeamDialog';
  require("../styles/dashboard.scss");

  export default {
    name: 'dashboard',
    props: ['accountId'],
    components: {
      ListTabView,
      CreateTeamDialog
    },
    computed: {
      listTabViewFormattedData: {
        get () {
          var objects = [];
          this.teams.forEach(function (team) {
            var teamRoute = '/teams/' + team.id;
            var tabsData = {
              title: team.name,
              bottomLeftBadges: team.members.map(
                member => ({
                  id: member.id,
                  title: member.email,
                  image: member.avatarLink
                })
              ),
              leftCount: team.templatesCount,
              rightCount: team.topicsCount,
              leftLabel: 'Templates',
              rightLabel: 'Topics'
            }
            var listData = {
              name: team.name,
              templatesCount: team.templatesCount,
              topicsCount: team.topicsCount,
              id: team.id,
              route: '/teams/' + team.id
            }
            objects.push({
              id: team.id,
              route: teamRoute,
              tabsData: tabsData,
              listData: listData
            })
          })

          return objects
        }
      },
      activeAccount () {
        return this.$store.state.common.activeAccount
      }
    },
    methods: {
      loadTeams (page) {
        if (!page) page = 1;

        if (this.activeAccount.id == undefined) {
          return
        }

        this.isLoading = true;
        this.$http.get(
          process.env.VUE_APP_API_URL + '/account/'+this.activeAccount.id+'/teams'
        ).then(response => {
          if (response.status === 200) {
            this.teams = response.body;
            this.isLoading = false;
          }
        })
      },
      teamCreated (team) {
        this.teams.push(team)
      },
      deleteTeam (teamId) {
        var team = this.teams.filter(team => team.id === teamId)[0]
        var apiUrl = process.env.VUE_APP_API_URL + '/team/'+team.id

        this.$http.delete(apiUrl).then(response => {
          if (response.status == 200) {
            this.teams.splice(this.teams.indexOf(team), 1)
          }
        })
      }
    },
    watch: {
      // eslint-disable-next-line
      activeAccount (newValue, oldValue) {
        this.loadTeams();
      }
    },
    created () {
      this.loadTeams();
    },
    data () {
      return {
        teams: [],
        containerDisplayMode: "list",
        teamsListHeaders: [
          { text: 'Name', value: 'name' },
          { text: 'Number of Topics', value: 'topicsCount' },
          { text: 'Number of Templates', value: 'templatesCount' },
          { text: 'Utils', value: 'utils' }
        ],
        createTeamDialog: false,
        isLoading: false,
        listTabOptions: [
          { text: 'list', callback: () => {}},
          { text: 'tabs', callback: () => {} }
        ]
      }
    }
  }
</script>