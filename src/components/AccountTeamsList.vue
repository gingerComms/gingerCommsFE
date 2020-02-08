<template>
  <div id="account-teams-list">
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
          @click="deleteTeam(slotProps.object.id)"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </ListTabView>
  </div>
</template>

<script>
  import ListTabView from '@/components/ListTabView';

  export default {
    name: 'account-teams-list',
    components: {
      ListTabView
    },
    props: {
      containerDisplayMode: String,
      accountId: String
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
      }
    }, 
    watch: {
      // eslint-disable-next-line
      accountId (newValue, oldValue) {
        this.loadTeams();
      }
    },
    methods: {
      loadTeams (page) {
        if (!page) page = 1;

        console.log('Loading for', this.accountId)
        this.teams = [];

        if (this.accountId == undefined) {
          return
        }

        this.isLoading = true;
        this.$http.get(
          process.env.VUE_APP_API_URL + '/account/'+this.accountId+'/teams'
        ).then(response => {
          if (response.status === 200) {
            this.teams = response.body;
            this.isLoading = false;
          }
        })
      },
      deleteTeam (teamId) {
        var team = this.teams.filter(team => team.id === teamId)[0]
        var apiUrl = process.env.VUE_APP_API_URL + '/team/'+team.id
        this.isLoading = true;

        this.$http.delete(apiUrl).then(response => {
          if (response.status == 200) {
            this.teams.splice(this.teams.indexOf(team), 1)
          }
          this.isLoading = false;
        // eslint-disable-next-line
        }, response => {
          this.isLoading = false;
        })
      },
      teamCreated (team) {
        this.teams.push(team);
      }
    },
    created () {
      this.loadTeams();
    },
    data () {
      return {
        teams: [],
        isLoading: false,
        teamsListHeaders: [
          { text: 'Name', value: 'name' },
          { text: 'Number of Topics', value: 'topicsCount' },
          { text: 'Number of Templates', value: 'templatesCount' },
          { text: 'Utils', value: 'utils' }
        ]
      }
    }
  }
</script>