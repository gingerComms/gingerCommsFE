<template>
  <div id="templates-list">
    <ListTabView
      :headers="templateHeaders"
      :objects="listTabViewFormattedData"
      mode="list"
      :isLoading="isLoading"
    >
      <slot v-slot:listUtils="{ slotProps }">
        {{ slotProps }}
      </slot>

      <template v-slot:listTopContent>
        <v-card outlined>
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
      :teamId="teamId"
      @dialogToggled="showDialog=false"
      @templateCreated="templateCreated"
    ></create-template-dialog>
  </div>
</template>

<script>
  import ListTabView from './ListTabView';
  import CreateTemplateDialog from './CreateTemplateDialog';

  export default {
    name: 'templates-list',
    props: {
      teamId: String
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
            var route = '/team/'+currentThis.teamId+'/'+template.name+'/'+template.id;
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
        templates: [],
        isLoading: true,
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
        var nodeId = this.teamId;
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
        this.templates.push(template);
      },
      deleteTemplate (templateId) {
        var template = this.templates.filter(template => template.id == templateId)[0];
        var apiUrl = process.env.VUE_APP_API_URL + '/team/' + this.teamId + '/templates/' + template.id;
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
    },
    created () {
      this.getTemplates();
    }
  }
</script>
