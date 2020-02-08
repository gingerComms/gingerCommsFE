<template>
  <div id="dashboard" class="template-content">
    <div class="row mb-1 mt-1 header-row">
      <div class="team-header-container col-3">
        <v-tooltip bottom nudge-left="45">
          <template class="create-team-button" v-slot:activator="{ on }">
            <div class="create-team-button" v-on="on" @click.stop="createTeamDialog=true">
              <h2>Teams</h2>
              <span>{{ $store.state.common.activeAccount.title }}</span>
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

    <account-teams-list
      :containerDisplayMode="containerDisplayMode"
      :accountId="this.activeAccount.id"
      ref="teamsList"
    ></account-teams-list>

    <CreateTeamDialog
      :showDialog="createTeamDialog"
      @dialogToggled="createTeamDialog=false"
      @teamCreated="teamCreated"
    ></CreateTeamDialog>

  </div>
</template>

<script>
  import CreateTeamDialog from '@/components/CreateTeamDialog';
  import AccountTeamsList from '@/components/AccountTeamsList';
  require("../styles/dashboard.scss");

  export default {
    name: 'dashboard',
    props: ['accountId'],
    components: {
      AccountTeamsList,
      CreateTeamDialog
    },
    computed: {
      activeAccount () {
        return this.$store.state.common.activeAccount
      }
    },
    methods: {
      teamCreated (team) {
        this.$refs.teamsList.teamCreated(team);
      }
    },
    data () {
      return {
        teams: [],
        containerDisplayMode: "list",
        createTeamDialog: false,
        listTabOptions: [
          { text: 'list', callback: () => {}},
          { text: 'tabs', callback: () => {} }
        ]
      }
    }
  }
</script>