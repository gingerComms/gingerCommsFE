<template>
  <div id="templates-list">
    <v-card-text v-if="templates">
      <ListTabView
        :headers="templateHeaders"
        :objects="listTabViewFormattedData"
        mode="list"
        :isLoading="isLoading"
      >
        <template v-slot:listTopContent>
          <v-card flat>
            <v-card-text>
              <v-btn
                color="#55cec7"
                raised
                dark
                @click="showDialog=true"
              >
                Create Template
              </v-btn>
            </v-card-text>
          </v-card>
        </template>

        <template v-slot:listUtils="{ object }">
          <v-btn
            icon
            @click="deleteTemplate(object.id)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </ListTabView>

      <create-template-dialog
        :showDialog="showDialog"
        :teamId="team.id"
        @dialogToggled="showDialog=false"
        @templateCreated="templateCreated"
      ></create-template-dialog>
    </v-card-text>
  </div>
</template>

<script>
  import ListTabView from './ListTabView';
  import CreateTemplateDialog from './CreateTemplateDialog';

  export default {
    name: 'templates-list',
    props: {
      team: Object,
      templates: Array
    },
    components: {
      ListTabView,
      CreateTemplateDialog
    },
    computed: {
      listTabViewFormattedData: {
        get () {
          var objects = [];
          var currentThis = this;
          this.templates.forEach(function (template) {
            var route = '/teams/'+currentThis.team.id+'/templates/'+template.id;
            var listData = {
              name: template.name,
              route: route,
              id: template.id,
              topicsCount: template.topicsCount
            }
            objects.push({
              id: template.id,
              route: route,
              tabsData: {},
              listData: listData
            })
          })
          return objects;
        }
      }
    },
    data () {
      return {
        isLoading: false,
        templateHeaders: [
          { text: 'Name', value: 'name' },
          { text: 'Number of Topics', value: 'topicsCount' },
          { text: 'Utils', value: 'utils' }
        ],
        showDialog: false
      }
    },
    methods: {
      getTemplates () {
        var nodeId = this.team.id;
        var apiUrl = process.env.VUE_APP_API_URL + '/team/' + nodeId + '/templates';
        this.isLoading = true;
        this.$http.get(apiUrl).then(response => {
          if (response.status == 200) {
            this.templates = response.body;
          }
          this.isLoading = false;
        }, response => {
          console.log("Error loading templates!", response)
          this.isLoading = false;
        })
      },
      templateCreated (template) {
        this.$emit('templateCreated', template);
      },
      deleteTemplate (templateId) {
        var template = this.templates.filter(template => template.id == templateId)[0];
        var apiUrl = process.env.VUE_APP_API_URL + '/team/' + this.team.id + '/templates/' + template.id;
        console.log(apiUrl)
        this.isLoading = true;
        this.$http.delete(apiUrl).then(response => {
          this.isLoading = false;
          if (response.status == 200) {
            this.templates.splice(this.templates.indexOf(template), 1);
          }
        // eslint-disable-next-line
        }, response => {
          this.isLoading = false;
        })
      }
    }
  }
</script>
